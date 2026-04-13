<?php

namespace App\Repositories\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface PaymentRepositoryInterface
{
    public function findByStudent(int $studentId): ?Model;
    public function create(array $data): Model;
    public function update(int $id, array $data): Model;
    public function addTransaction(array $data): Model;
    public function getMonthlyRevenue(int $year, int $month): float;
    public function getYearlyRevenue(int $year): float;
    public function getMonthlyRevenueBreakdown(int $year): array;
    public function getPendingPayments(): Collection;
    public function generatePaymentNumber(): string;
}
