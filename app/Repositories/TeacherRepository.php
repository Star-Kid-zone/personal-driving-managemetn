<?php

namespace App\Repositories;

use App\Models\Teacher;
use App\Repositories\Interfaces\TeacherRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class TeacherRepository implements TeacherRepositoryInterface
{
    public function __construct(private Teacher $model) {}

    public function all(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->with(['user'])
            ->withCount(['students', 'trips']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->whereHas('user', fn($q) =>
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
            );
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    public function find(int $id): ?Model
    {
        return $this->model->with(['user', 'students.payment', 'trips'])
            ->withCount(['students', 'trips'])
            ->findOrFail($id);
    }

    public function findByUserId(int $userId): ?Model
    {
        return $this->model->where('user_id', $userId)->with(['user'])->first();
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): Model
    {
        $teacher = $this->model->findOrFail($id);
        $teacher->update($data);
        return $teacher->fresh(['user']);
    }

    public function delete(int $id): bool
    {
        return (bool) $this->model->findOrFail($id)->delete();
    }

    public function getWithStudentCounts(): Collection
    {
        return $this->model->with('user')
            ->withCount([
                'students',
                'students as active_students_count' => fn($q) => $q->where('status', 'active'),
            ])
            ->where('is_active', true)
            ->get();
    }

    public function generateEmployeeId(): string
    {
        $count = $this->model->count() + 1;
        return sprintf('TCH-%04d', $count);
    }
}
