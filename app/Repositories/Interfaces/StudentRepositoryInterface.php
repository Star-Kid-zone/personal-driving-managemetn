<?php

namespace App\Repositories\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface StudentRepositoryInterface
{
    public function all(array $filters = []): LengthAwarePaginator;
    public function find(int $id): ?Model;
    public function findByStudentId(string $studentId): ?Model;
    public function findByAccessToken(string $token): ?Model;
    public function create(array $data): Model;
    public function update(int $id, array $data): Model;
    public function delete(int $id): bool;
    public function getByTeacher(int $teacherId): Collection;
    public function getActiveStudents(): Collection;
    public function getIncompleteStudents(): Collection;
    public function getDashboardStats(): array;
    public function generateStudentId(): string;
}
