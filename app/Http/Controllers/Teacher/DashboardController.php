<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use App\Services\TripService;
use App\Models\Teacher;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService,
        private TripService      $tripService,
    ) {}

    public function index(): Response
    {
        $teacher = auth()->user()->teacher;
        $data    = $this->dashboardService->getTeacherDashboard($teacher->id);

        $data['todayTrips']    = $this->tripService->getTodaysTrips($teacher->id);
        $data['upcomingTrips'] = $this->tripService->getUpcomingTrips($teacher->id);

        return Inertia::render('Teacher/Dashboard', $data);
    }
}
