<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\LlrService;
use App\Models\LlrRecord;
use App\Models\Student;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class LlrController extends Controller
{
    public function __construct(private LlrService $llrService) {}

    public function index(): \Inertia\Response
    {
        $allRecords   = LlrRecord::with(['student'])->get();
        $awaiting     = $this->llrService->getStudentsAwaitingLlr();
        $eligible     = $this->llrService->getDlEligibleStudents();
        $upcomingTests= $this->llrService->getUpcomingTests();

        return Inertia::render('Admin/LlrIndex', compact('allRecords', 'awaiting', 'eligible', 'upcomingTests'));
    }

    public function update(Request $request, Student $student): RedirectResponse
    {
        $this->llrService->updateLlrRecord($student->id, $request->validate([
            'llr_status'       => 'required|string',
            'llr_applied_date' => 'nullable|date',
            'llr_test_date'    => 'nullable|date',
            'llr_issued_date'  => 'nullable|date',
            'llr_expiry_date'  => 'nullable|date',
            'llr_number'       => 'nullable|string',
            'dl_status'        => 'nullable|string',
            'dl_applied_date'  => 'nullable|date',
            'dl_test_date'     => 'nullable|date',
            'dl_issued_date'   => 'nullable|date',
            'dl_number'        => 'nullable|string',
            'rto_office'       => 'nullable|string',
            'notes'            => 'nullable|string',
        ]));

        return back()->with('success', 'LLR/DL record updated for '.$student->name);
    }
}
