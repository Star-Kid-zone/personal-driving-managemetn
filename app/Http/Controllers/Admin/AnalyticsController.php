<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Payment;
use App\Models\PaymentTransaction;
use App\Models\Teacher;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index(): \Inertia\Response
    {
        $year = now()->year;

        // Monthly revenue breakdown
        $monthlyRevenue = collect(range(1, 12))->map(function ($m) use ($year) {
            return [
                'month'   => date('M', mktime(0,0,0,$m,1)),
                'revenue' => (float) PaymentTransaction::whereYear('paid_on', $year)
                                ->whereMonth('paid_on', $m)->sum('amount'),
            ];
        });

        // Vehicle type breakdown
        $vehicleTypeBreakdown = Student::selectRaw('vehicle_type as name, COUNT(*) as value')
            ->groupBy('vehicle_type')->get();

        // Student status breakdown
        $studentStatusBreakdown = Student::selectRaw('status as name, COUNT(*) as value')
            ->groupBy('status')->get();

        // Enrollment trend (last 12 months)
        $enrollmentTrend = collect(range(11, 0))->map(function ($i) {
            $date = now()->subMonths($i);
            return [
                'month' => $date->format('M'),
                'count' => Student::whereYear('created_at', $date->year)
                               ->whereMonth('created_at', $date->month)->count(),
            ];
        });

        // Payment status breakdown
        $paymentStatusBreakdown = Payment::selectRaw('payment_status as status, COUNT(*) as count')
            ->groupBy('payment_status')->get();

        // Top teachers
        $topTeachers = Teacher::with('user')
            ->withCount([
                'students',
                'students as active_students_count' => fn($q) => $q->where('status','active'),
                'trips as completed_trips_count'    => fn($q) => $q->whereNotNull('end_time'),
            ])
            ->where('is_active', true)
            ->orderByDesc('students_count')
            ->limit(6)->get();

        $yearlyRevenue  = (float) PaymentTransaction::whereYear('paid_on', $year)->sum('amount');
        $totalStudents  = Student::count();
        $activeStudents = Student::where('status', 'active')->count();

        return Inertia::render('Admin/Analytics', compact(
            'monthlyRevenue', 'vehicleTypeBreakdown', 'studentStatusBreakdown',
            'enrollmentTrend', 'paymentStatusBreakdown', 'topTeachers',
            'yearlyRevenue', 'totalStudents', 'activeStudents'
        ));
    }
}
