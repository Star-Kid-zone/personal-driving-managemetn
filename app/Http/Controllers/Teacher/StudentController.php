<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\EnrollStudentRequest;
use App\Services\StudentService;
use App\Services\LlrService;
use App\Services\PaymentService;
use App\Services\InvoiceService;
use App\Models\Vehicle;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function __construct(
        private StudentService $studentService,
        private LlrService     $llrService,
        private PaymentService $paymentService,
        private InvoiceService $invoiceService,
    ) {}

    public function index(Request $request): Response
    {
        $teacher  = auth()->user()->teacher;
        $filters  = array_merge($request->only(['search', 'status']), ['teacher_id' => $teacher->id]);
        $students = $this->studentService->list($filters);

        return Inertia::render('Teacher/Students/Index', [
            'students' => $students,
            'filters'  => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        $vehicles = Vehicle::active()->get();
        return Inertia::render('Teacher/Students/Create', compact('vehicles'));
    }

    public function store(EnrollStudentRequest $request): RedirectResponse
    {
        $data              = $request->validated();
        $data['teacher_id']= auth()->user()->teacher->id;
        $student           = $this->studentService->enroll($data);

        return redirect()->route('teacher.students.show', $student->id)
            ->with('success', "Student {$student->name} enrolled! ID: {$student->student_id}");
    }

    public function show(int $id): Response
    {
        $student = $this->studentService->findById($id);
        return Inertia::render('Teacher/Students/Show', compact('student'));
    }

    public function updateLlr(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'llr_status'       => 'required|string',
            'llr_applied_date' => 'nullable|date',
            'llr_test_date'    => 'nullable|date',
            'llr_issued_date'  => 'nullable|date',
            'llr_number'       => 'nullable|string',
            'dl_status'        => 'nullable|string',
            'dl_test_date'     => 'nullable|date',
            'rto_office'       => 'nullable|string',
        ]);

        $this->llrService->updateLlrRecord($id, $request->validated());

        return back()->with('success', 'LLR/DL record updated successfully.');
    }

    public function recordPayment(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'amount'       => 'required|numeric|min:1',
            'payment_mode' => 'required|in:cash,upi,card,bank_transfer,cheque',
            'paid_on'      => 'required|date',
            'notes'        => 'nullable|string',
        ]);

        $student = $this->studentService->findById($id);
        $payment = $this->paymentService->getByStudent($id);

        if (!$payment) {
            return back()->with('error', 'No payment record found.');
        }

        $this->paymentService->recordPayment($payment->id, array_merge(
            $request->validated(),
            ['student_id' => $id]
        ));

        return back()->with('success', 'Payment of ₹'.number_format($request->amount).' recorded.');
    }

    public function downloadInvoice(int $id): RedirectResponse
    {
        $invoice = $this->invoiceService->generateForStudent($id);
        return redirect()->away($invoice->pdf_url);
    }

    public function llrList(): Response
    {
        $teacher  = auth()->user()->teacher;
        $awaiting = $this->llrService->getStudentsAwaitingLlr()
            ->filter(fn($r) => $r->student->teacher_id === $teacher->id);
        $eligible = $this->llrService->getDlEligibleStudents()
            ->filter(fn($r) => $r->student->teacher_id === $teacher->id);
        $tests    = $this->llrService->getUpcomingTests()
            ->filter(fn($r) => $r->student->teacher_id === $teacher->id);

        return Inertia::render('Teacher/LlrTracking', [
            'awaiting' => $awaiting->values(),
            'eligible' => $eligible->values(),
            'tests'    => $tests->values(),
        ]);
    }
}
