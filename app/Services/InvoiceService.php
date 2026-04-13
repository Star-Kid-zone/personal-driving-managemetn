<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Student;
use Illuminate\Support\Facades\Storage;

class InvoiceService
{
    public function generateForStudent(int $studentId): Invoice
    {
        $student = Student::with(['payment', 'teacher.user'])->findOrFail($studentId);
        $payment = $student->payment;

        $year          = now()->year;
        $count         = Invoice::whereYear('created_at', $year)->count() + 1;
        $invoiceNumber = sprintf('INV-%d-%04d', $year, $count);

        $lineItems = [
            [
                'description' => 'Driving Course — ' . ucfirst($student->vehicle_type),
                'amount'      => (float) ($payment?->total_fee ?? 0),
            ],
        ];

        $total      = (float) ($payment?->total_fee ?? 0);
        $amountPaid = (float) ($payment?->amount_paid ?? 0);

        $invoice = Invoice::updateOrCreate(
            ['student_id' => $studentId],
            [
                'invoice_number' => $invoiceNumber,
                'payment_id'     => $payment?->id,
                'subtotal'       => $total,
                'discount'       => 0,
                'tax'            => 0,
                'total'          => $total,
                'amount_paid'    => $amountPaid,
                'invoice_date'   => now()->toDateString(),
                'status'         => ($payment?->payment_status === 'paid') ? 'paid' : 'partial',
                'line_items'     => $lineItems,
                'created_by'     => auth()->id(),
            ]
        );

        // Generate PDF only if DomPDF is available
        if (class_exists(\Barryvdh\DomPDF\Facade\Pdf::class)) {
            try {
                $pdf  = \Barryvdh\DomPDF\Facade\Pdf::loadView('invoices.pdf', compact('invoice', 'student', 'payment'));
                $path = 'invoices/' . $invoice->invoice_number . '.pdf';
                Storage::disk(config('filesystems.default', 'local'))->put($path, $pdf->output());
                $invoice->update(['pdf_path' => $path]);
            } catch (\Throwable $e) {
                // PDF generation failed silently — invoice record still saved
            }
        }

        return $invoice->fresh();
    }
}
