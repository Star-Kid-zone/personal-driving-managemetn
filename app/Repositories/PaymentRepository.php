<?php

namespace App\Repositories;

use App\Models\Payment;
use App\Models\PaymentTransaction;
use App\Repositories\Interfaces\PaymentRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PaymentRepository implements PaymentRepositoryInterface
{
    public function __construct(
        private Payment            $model,
        private PaymentTransaction $transactionModel
    ) {}

    public function findByStudent(int $studentId): ?Model
    {
        return $this->model->where('student_id', $studentId)
            ->with(['transactions', 'receivedBy'])
            ->first();
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): Model
    {
        $payment = $this->model->findOrFail($id);
        $payment->update($data);
        return $payment->fresh();
    }

    public function addTransaction(array $data): Model
    {
        return DB::transaction(function () use ($data) {
            $transaction = $this->transactionModel->create($data);
            $payment     = $this->model->findOrFail($data['payment_id']);
            $payment->increment('amount_paid', $data['amount']);
            $payment->updateStatus();
            return $transaction;
        });
    }

    public function getMonthlyRevenue(int $year, int $month): float
    {
        return (float) $this->transactionModel
            ->whereYear('paid_on', $year)
            ->whereMonth('paid_on', $month)
            ->sum('amount');
    }

    public function getYearlyRevenue(int $year): float
    {
        return (float) $this->transactionModel
            ->whereYear('paid_on', $year)
            ->sum('amount');
    }

    public function getMonthlyRevenueBreakdown(int $year): array
    {
        $data = $this->transactionModel
            ->whereYear('paid_on', $year)
            ->selectRaw('MONTH(paid_on) as month, SUM(amount) as total')
            ->groupBy('month')
            ->pluck('total', 'month')
            ->toArray();

        $result = [];
        for ($m = 1; $m <= 12; $m++) {
            $result[] = [
                'month'   => date('M', mktime(0, 0, 0, $m, 1)),
                'revenue' => (float) ($data[$m] ?? 0),
            ];
        }
        return $result;
    }

    public function getPendingPayments(): Collection
    {
        return $this->model
            ->whereIn('payment_status', ['pending', 'partial'])
            ->with(['student'])
            ->get()
            ->sortByDesc(fn($p) => $p->balance_due)
            ->values();
    }

    public function generatePaymentNumber(): string
    {
        $year  = now()->year;
        $count = $this->model->whereYear('created_at', $year)->count() + 1;
        return sprintf('PAY-%d-%04d', $year, $count);
    }
}
