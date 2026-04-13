<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Services\StudentService;
use App\Services\InvoiceService;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class PortalController extends Controller
{
    public function __construct(
        private StudentService $studentService,
        private InvoiceService $invoiceService,
    ) {}

    public function entry(): Response
    {
        return Inertia::render('Student/Portal/Entry');
    }

    public function access(Request $request): RedirectResponse
    {
        $request->validate([
            'identifier' => 'required|string|min:3|max:80',
        ]);

        $identifier = trim(strtoupper($request->identifier));

        // Try by student_id first (e.g. DM-2024-0001), then by access_token
        $student = $this->studentService->findByStudentId($identifier)
                ?? $this->studentService->findByAccessToken($request->identifier);

        if (!$student) {
            return back()->withErrors([
                'identifier' => 'No student found with this ID. Please check and try again.',
            ]);
        }

        session(['student_portal_id' => $student->id]);

        return redirect()->route('student.portal.dashboard');
    }

    public function dashboard(): Response
    {
        $studentId = session('student_portal_id');

        if (!$studentId) {
            return redirect()->route('student.portal.entry')
                ->with('error', 'Please enter your Student ID to access the portal.');
        }

        $student = $this->studentService->findById($studentId);

        // Group driving history by month
        $drivingHistory = $student->trips()
            ->with('trip')
            ->latest('created_at')
            ->get()
            ->groupBy(fn($ts) => $ts->trip?->trip_date?->format('M Y') ?? 'Unknown');

        return Inertia::render('Student/Portal/Dashboard', [
            'student'        => $student,
            'drivingHistory' => $drivingHistory,
        ]);
    }

    public function downloadInvoice(): RedirectResponse
    {
        $studentId = session('student_portal_id');

        if (!$studentId) {
            return redirect()->route('student.portal.entry');
        }

        $invoice = $this->invoiceService->generateForStudent($studentId);

        return redirect()->away($invoice->pdf_url ?? route('student.portal.dashboard'));
    }

    public function logout(): RedirectResponse
    {
        session()->forget('student_portal_id');
        return redirect()->route('student.portal.entry')
            ->with('success', 'You have been logged out of the student portal.');
    }
}
