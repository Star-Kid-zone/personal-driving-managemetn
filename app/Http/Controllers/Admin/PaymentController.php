<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use App\Models\Payment;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class PaymentController extends Controller
{
    public function __construct(private PaymentService $paymentService) {}

    public function index(): \Inertia\Response
    {
        $payments = Payment::with(['student', 'transactions', 'receivedBy'])
            ->latest()->paginate(20);

        $pendingPayments = $this->paymentService->getPendingPayments();
        $revenueStats    = $this->paymentService->getRevenueStats(now()->year);

        return Inertia::render('Admin/Payments/Index', compact('payments', 'pendingPayments', 'revenueStats'));
    }

    public function record(Request $request, Payment $payment): RedirectResponse
    {
        $request->validate([
            'amount'       => 'required|numeric|min:1',
            'payment_mode' => 'required|in:cash,upi,card,bank_transfer,cheque',
            'paid_on'      => 'required|date',
            'notes'        => 'nullable|string',
        ]);

        $this->paymentService->recordPayment($payment->id, array_merge(
            $request->validated(),
            ['student_id' => $payment->student_id]
        ));

        return back()->with('success', 'Payment of ₹'.number_format($request->amount).' recorded successfully.');
    }
}
