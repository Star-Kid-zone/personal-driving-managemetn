<?php

namespace App\Services;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\Trip;
use App\Models\Payment;
use App\Models\PaymentTransaction;
use App\Models\LlrRecord;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function __construct(private PaymentService $paymentService) {}

    public function getAdminDashboard(): array
    {
        $year  = now()->year;
        $month = now()->month;

        $totalStudents   = Student::count();
        $activeStudents  = Student::where('status', 'active')->count();
        $newThisMonth    = Student::whereMonth('created_at', $month)->whereYear('created_at', $year)->count();

        $yearlyRevenue    = (float) PaymentTransaction::whereYear('paid_on', $year)->sum('amount');
        $monthlyRevenue   = (float) PaymentTransaction::whereYear('paid_on', $year)->whereMonth('paid_on', $month)->sum('amount');
        $lastMonth        = $month === 1 ? 12 : $month - 1;
        $lastYear         = $month === 1 ? $year - 1 : $year;
        $lastMonthRevenue = (float) PaymentTransaction::whereYear('paid_on', $lastYear)->whereMonth('paid_on', $lastMonth)->sum('amount');
        $revenueGrowth    = $lastMonthRevenue > 0
            ? round((($monthlyRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
            : 0;

        $pendingPayments = Payment::whereIn('payment_status', ['pending', 'partial'])
            ->get()
            ->sum(fn($p) => max(0, $p->total_fee - $p->amount_paid));

        $monthlyBreakdown = $this->paymentService->getRevenueStats($year)['breakdown'];

        $upcomingTests = LlrRecord::where(function ($q) {
            $q->where('llr_test_date', '>=', now())
              ->orWhere('dl_test_date', '>=', now());
        })->with('student')->orderByRaw('COALESCE(llr_test_date, dl_test_date)')->limit(5)->get();

        $recentStudents = Student::with(['payment'])
            ->latest()->limit(5)->get();

        $teacherStats = Teacher::with('user')
            ->withCount([
                'trips as completed_trips_count'    => fn($q) => $q->whereNotNull('end_time'),
            ])
            ->where('is_active', true)->get();

        return compact(
            'totalStudents', 'activeStudents', 'newThisMonth',
            'yearlyRevenue', 'monthlyRevenue', 'revenueGrowth',
            'pendingPayments', 'monthlyBreakdown',
            'upcomingTests', 'recentStudents', 'teacherStats'
        );
    }

    public function getTeacherDashboard(int $teacherId): array
    {
        $myStudents     = Student::whereHas('trips.trip', fn($q) => $q->where('teacher_id', $teacherId))->count();
        $activeStudents = Student::whereHas('trips.trip', fn($q) => $q->where('teacher_id', $teacherId))->where('status', 'active')->count();
        $todaysTrips    = Trip::where('teacher_id', $teacherId)->whereDate('trip_date', today())->count();
        $totalTrips     = Trip::where('teacher_id', $teacherId)->whereNotNull('end_time')->count();

        $llrPending = LlrRecord::whereHas('student.trips.trip', fn($q) => $q->where('teacher_id', $teacherId))
            ->where('llr_status', 'not_applied')->count();

        $dlEligible = LlrRecord::whereHas('student.trips.trip', fn($q) => $q->where('teacher_id', $teacherId))
            ->where('dl_eligible', true)
            ->whereNotIn('dl_status', ['issued'])->count();

        $incompleteStudents = Student::whereHas('trips.trip', fn($q) => $q->where('teacher_id', $teacherId))
            ->where('status', 'active')
            ->whereColumn('completed_sessions', '<', 'total_sessions')
            ->with(['payment'])
            ->limit(10)->get();

        $upcomingTests = LlrRecord::whereHas('student.trips.trip', fn($q) => $q->where('teacher_id', $teacherId))
            ->where(function ($q) {
                $q->where('llr_test_date', '>=', now())
                  ->orWhere('dl_test_date', '>=', now());
            })
            ->with('student')
            ->orderByRaw('COALESCE(llr_test_date, dl_test_date)')
            ->limit(5)->get();

        return compact(
            'myStudents', 'activeStudents', 'todaysTrips', 'totalTrips',
            'llrPending', 'dlEligible', 'incompleteStudents', 'upcomingTests'
        );
    }
}
