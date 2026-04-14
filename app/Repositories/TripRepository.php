<?php

namespace App\Repositories;

use App\Models\Trip;
use App\Models\Student;
use App\Repositories\Interfaces\TripRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class TripRepository implements TripRepositoryInterface
{
    public function __construct(private Trip $model) {}

    public function all(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->with(['teacher.user', 'vehicle', 'students'])
            ->withCount('students')
            ->latest('trip_date');

        if (!empty($filters['teacher_id'])) {
            $query->where('teacher_id', $filters['teacher_id']);
        }
        if (!empty($filters['date'])) {
            $query->whereDate('trip_date', $filters['date']);
        }

        if (!empty($filters['vehicle_type'])) {
            $query->where('vehicle_type', $filters['vehicle_type']);
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    public function find(int $id): ?Model
    {
        return $this->model->with([
            'teacher.user', 'vehicle', 'tripStudents.student',
        ])->findOrFail($id);
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): Model
    {
        $trip = $this->model->findOrFail($id);
        $trip->update($data);
        return $trip->fresh();
    }

    public function addStudentsToTrip(int $tripId, array $studentIds): void
    {
        $trip     = $this->model->findOrFail($tripId);
        $syncData = [];
        foreach ($studentIds as $studentId) {
            $student = Student::find($studentId);
            if ($student) {
                $syncData[$studentId] = [
                    'attended'       => true,
                    'session_number' => $student->completed_sessions + 1,
                ];
            }
        }
        $trip->students()->sync($syncData);
    }

    public function completeTrip(int $tripId): Model
    {
        return DB::transaction(function () use ($tripId) {
            $trip = $this->model->with('tripStudents.student')->findOrFail($tripId);

            foreach ($trip->tripStudents as $tripStudent) {
                if ($tripStudent->attended && $tripStudent->student) {
                    $student = $tripStudent->student;
                    $student->increment('completed_sessions');
                    // Check if completed all sessions
                    if ($student->fresh()->completed_sessions >= $student->total_sessions) {
                        $student->update(['status' => 'completed']);
                    }
                }
            }

            $trip->update(['end_time' => now()]);
            return $trip->fresh();
        });
    }

    public function getTodaysTrips(int $teacherId): Collection
    {
        return $this->model->where('teacher_id', $teacherId)
            ->today()
            ->with(['vehicle', 'students'])
            ->withCount('students')
            ->get();
    }

    public function getUpcomingTrips(int $teacherId): Collection
    {
        return $this->model->where('teacher_id', $teacherId)
            ->upcoming()
            ->with(['vehicle', 'students'])
            ->withCount('students')
            ->limit(10)
            ->get();
    }

    public function generateTripNumber(): string
    {
        $year  = now()->year;
        $count = $this->model->whereYear('created_at', $year)->count() + 1;
        return sprintf('TRIP-%d-%04d', $year, $count);
    }
}
