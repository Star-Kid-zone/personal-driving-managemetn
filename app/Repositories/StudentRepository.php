<?php

namespace App\Repositories;

use App\Models\Student;
use App\Repositories\Interfaces\StudentRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class StudentRepository implements StudentRepositoryInterface
{
    public function __construct(private Student $model) {}

    public function all(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->newQuery()
            ->with(['payment', 'llrRecord'])
            ->latest();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('student_id', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['vehicle_type'])) {
            $query->where('vehicle_type', $filters['vehicle_type']);
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    public function find(int $id): ?Model
    {
        return $this->model->with([
            'payment.transactions',
            'llrRecord', 'documents', 'trips.trip',
        ])->findOrFail($id);
    }

    public function findByStudentId(string $studentId): ?Model
    {
        return $this->model->where('student_id', $studentId)
            ->with(['payment', 'llrRecord'])
            ->first();
    }

    public function findByAccessToken(string $token): ?Model
    {
        return $this->model->where('access_token', $token)
            ->with(['payment.transactions', 'llrRecord', 'trips.trip'])
            ->first();
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): Model
    {
        $student = $this->model->findOrFail($id);
        $student->update($data);
        return $student->fresh();
    }

    public function delete(int $id): bool
    {
        return (bool) $this->model->findOrFail($id)->delete();
    }

    public function getByTeacher(int $teacherId): Collection
    {
        return $this->model->whereHas('trips.trip', fn($q) => $q->where('teacher_id', $teacherId))
            ->with(['payment', 'llrRecord'])
            ->active()
            ->orderBy('name')
            ->get();
    }

    public function getActiveStudents(): Collection
    {
        return $this->model->active()
            ->with(['payment'])
            ->orderBy('name')
            ->get();
    }

    public function getIncompleteStudents(): Collection
    {
        return $this->model->where('status', 'active')
            ->whereColumn('completed_sessions', '<', 'total_sessions')
            ->with(['payment'])
            ->get();
    }

    public function getDashboardStats(): array
    {
        $year  = now()->year;
        $month = now()->month;
        return [
            'total'      => $this->model->count(),
            'active'     => $this->model->where('status', 'active')->count(),
            'completed'  => $this->model->where('status', 'completed')->count(),
            'this_month' => $this->model->whereMonth('created_at', $month)->whereYear('created_at', $year)->count(),
        ];
    }

    public function generateStudentId(): string
    {
        $year  = now()->year;
        $count = $this->model->whereYear('created_at', $year)->count() + 1;
        return sprintf('DM-%d-%04d', $year, $count);
    }
}
