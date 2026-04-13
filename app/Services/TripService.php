<?php

namespace App\Services;

use App\Models\Trip;
use App\Repositories\Interfaces\TripRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class TripService
{
    public function __construct(private TripRepositoryInterface $tripRepo) {}

    public function list(array $filters = []): LengthAwarePaginator
    {
        return $this->tripRepo->all($filters);
    }

    public function find(int $id): Trip
    {
        return $this->tripRepo->find($id);
    }

    public function create(array $data): Trip
    {
        $data['trip_number'] = $this->tripRepo->generateTripNumber();
        $data['status']      = 'scheduled';
        $trip = $this->tripRepo->create($data);

        if (!empty($data['student_ids'])) {
            $this->tripRepo->addStudentsToTrip($trip->id, $data['student_ids']);
        }

        return $trip->fresh(['teacher.user', 'vehicle', 'students']);
    }

    public function update(int $id, array $data): Trip
    {
        $trip = $this->tripRepo->update($id, $data);

        if (isset($data['student_ids'])) {
            $this->tripRepo->addStudentsToTrip($trip->id, $data['student_ids']);
        }

        return $trip;
    }

    public function completeTrip(int $tripId, array $attendanceData = []): Trip
    {
        // Update individual attendance records if provided
        if (!empty($attendanceData)) {
            $trip = $this->tripRepo->find($tripId);
            foreach ($attendanceData as $studentId => $attended) {
                $trip->tripStudents()
                    ->where('student_id', $studentId)
                    ->update([
                        'attended'          => $attended['attended'] ?? true,
                        'performance_notes' => $attended['notes'] ?? null,
                        'skill_rating'      => $attended['skill_rating'] ?? null,
                    ]);
            }
        }

        return $this->tripRepo->completeTrip($tripId);
    }

    public function getTodaysTrips(int $teacherId): Collection
    {
        return $this->tripRepo->getTodaysTrips($teacherId);
    }

    public function getUpcomingTrips(int $teacherId): Collection
    {
        return $this->tripRepo->getUpcomingTrips($teacherId);
    }
}
