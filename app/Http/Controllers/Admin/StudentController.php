<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\EnrollStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Services\InvoiceService;
use App\Services\LlrService;
use App\Services\PaymentService;
use App\Services\StudentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function __construct(
        private StudentService $studentService,
        private LlrService $llrService,
        private PaymentService $paymentService,
        private InvoiceService $invoiceService,
    ) {}

    public function index(Request $request): Response
    {
        $students = $this->studentService->list($request->only(['search', 'status', 'vehicle_type', 'session_status']));

        return Inertia::render('Admin/Students/Index', [
            'students' => $students,
            'filters' => $request->only(['search', 'status', 'vehicle_type']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Students/Create');
    }

    public function store(EnrollStudentRequest $request): RedirectResponse
    {
        $student = $this->studentService->enroll($request->validated());

        return redirect()->route('admin.students.show', $student->id)
            ->with('success', "Student {$student->name} enrolled successfully! ID: {$student->student_id}");
    }

    public function show(int $id): Response
    {
        $student = $this->studentService->findById($id);

        return Inertia::render('Admin/Students/Show', [
            'student' => $student,
        ]);
    }

    public function edit(int $id): Response
    {
        $student = $this->studentService->findById($id);

        return Inertia::render('Admin/Students/Edit', compact('student'));
    }

    public function update(UpdateStudentRequest $request, int $id): RedirectResponse
    {
        $this->studentService->update($id, $request->validated());

        return redirect()->route('admin.students.show', $id)
            ->with('success', 'Student updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->studentService->delete($id);

        return redirect()->route('admin.students.index')
            ->with('success', 'Student removed successfully.');
    }

    public function generateInvoice(int $id): RedirectResponse
    {
        $invoice = $this->invoiceService->generateForStudent($id);

        return redirect()->away($invoice->pdf_url);
    }
}
