<?php

namespace App\Repositories\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface TeacherRepositoryInterface
{
    public function all(array $filters = []): LengthAwarePaginator;
    public function find(int $id): ?Model;
    public function findByUserId(int $userId): ?Model;
    public function create(array $data): Model;
    public function update(int $id, array $data): Model;
    public function delete(int $id): bool;
    public function getWithStudentCounts(): Collection;
}
