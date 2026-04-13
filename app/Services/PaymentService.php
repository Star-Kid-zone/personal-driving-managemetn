<?php

namespace App\Services;

use App\Models\Payment;
use App\Repositories\Interfaces\PaymentRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class PaymentService
{
    public function __construct(private PaymentRepositoryInterface $paymentRepo) {}

    public function getByStudent(int $studentId): ?Payment
    {
        return $this->paymentRepo->findByStudent($studentId);
    }

    public function recordPayment(int $paymentId, array $data): \App\Models\PaymentTransaction
    {
        $data['payment_id']  = $paymentId;
        $data['received_by'] = auth()->id();
        return $this->paymentRepo->addTransaction($data);
    }

    public function getRevenueStats(int $year): array
    {
        return [
            'yearly'    => $this->paymentRepo->getYearlyRevenue($year),
            'monthly'   => $this->paymentRepo->getMonthlyRevenue($year, now()->month),
            'breakdown' => $this->paymentRepo->getMonthlyRevenueBreakdown($year),
            'pending'   => $this->paymentRepo->getPendingPayments()->sum('balance_due'),
        ];
    }

    public function getPendingPayments(): Collection
    {
        return $this->paymentRepo->getPendingPayments();
    }
}
