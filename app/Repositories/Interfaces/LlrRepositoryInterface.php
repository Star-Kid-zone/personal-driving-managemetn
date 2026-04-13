<?php

namespace App\Repositories\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface LlrRepositoryInterface
{
    public function findByStudent(int $studentId): ?Model;
    public function createOrUpdate(int $studentId, array $data): Model;
    public function getStudentsAwaitingLlr(): Collection;
    public function getStudentsDlEligible(): Collection;
    public function getUpcomingTests(): Collection;
    public function checkDlEligibility(): void;
}
