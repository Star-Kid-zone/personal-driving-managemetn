<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Services\TripService;
use App\Models\Student;
use App\Models\Vehicle;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TripController extends Controller
{
    public function __construct(private TripService $tripService) {}

    public function index(Request $request): Response
    {
        $teacher = auth()->user()->teacher;
        $filters = array_merge($request->only(['date']), ['teacher_id' => $teacher->id]);
        $trips   = $this->tripService->list($filters);

        return Inertia::render('Teacher/Trips/Index', [
            'trips'   => $trips,
            'filters' => $request->only(['date']),
        ]);
    }

    public function create(): Response
    {
        $teacher  = auth()->user()->teacher;
        $vehicles = Vehicle::active()->where('type', $teacher->specialization === 'both' ? '!=' : $teacher->specialization)->get();
        $allVehicles = Vehicle::active()->get();
        $students = Student::active()
            ->whereColumn('completed_sessions', '<', 'total_sessions')
            ->get();

        return Inertia::render('Teacher/Trips/Create', [
            'vehicles' => $allVehicles,
            'students' => $students,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $teacher = auth()->user()->teacher;

        $request->validate([
            'vehicle_id'   => 'required|exists:vehicles,id',
            'trip_date'    => 'required|date|after_or_equal:today',
            'start_time'   => 'required',
            'vehicle_type' => 'required|in:bike,car',
            'student_ids'  => 'required|array|min:1',
            'student_ids.*'=> 'exists:students,id',
        ]);

        $trip = $this->tripService->create(array_merge(
            $request->all(),
            ['teacher_id' => $teacher->id]
        ));

        return redirect()->route('teacher.trips.show', $trip->id)
            ->with('success', "Trip {$trip->trip_number} scheduled.");
    }

    public function show(int $id): Response
    {
        $trip = $this->tripService->find($id);
        return Inertia::render('Teacher/Trips/Show', compact('trip'));
    }

    public function complete(Request $request, int $id): RedirectResponse
    {
        $this->tripService->completeTrip($id, $request->get('attendance', []));

        return redirect()->route('teacher.trips.index')
            ->with('success', 'Trip completed! Sessions updated for all students.');
    }
}
