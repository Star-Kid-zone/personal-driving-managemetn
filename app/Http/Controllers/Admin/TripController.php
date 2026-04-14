<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\TripService;
use App\Models\Teacher;
use App\Models\Vehicle;
use App\Models\Student;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class TripController extends Controller
{
    public function __construct(private TripService $tripService) {}

    public function index(Request $request): \Inertia\Response
    {
        $trips    = $this->tripService->list($request->only(['teacher_id', 'date', 'vehicle_type']));
        $teachers = Teacher::with('user')->where('is_active', true)->get();

        return Inertia::render('Admin/Trips/Index', [
            'trips'    => $trips,
            'teachers' => $teachers,
            'filters'  => $request->only(['teacher_id', 'date']),
        ]);
    }

    public function create(): \Inertia\Response
    {
        $vehicles = Vehicle::active()->get();
        $students = Student::active()->get();

        return Inertia::render('Admin/Trips/Create', compact('vehicles', 'students'));
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'vehicle_id'   => 'required|exists:vehicles,id',
            'trip_date'    => 'required|date',
            'start_time'   => 'required',
            'vehicle_type' => 'required|in:bike,car',
            'student_ids'  => 'array',
            'student_ids.*'=> 'exists:students,id',
        ]);

        $data = $request->all();
        
        // Ensure the admin has a teacher profile to link the trip
        $teacher = auth()->user()->teacher ?: \App\Models\Teacher::firstOrCreate(
            ['user_id' => auth()->id()],
            [
                'employee_id' => 'ADMIN-' . auth()->id(),
                'specialization' => 'both',
                'is_active' => true
            ]
        );
        
        $data['teacher_id'] = $teacher->id;

        $trip = $this->tripService->create($data);

        return redirect()->route('admin.trips.show', $trip->id)
            ->with('success', "Trip {$trip->trip_number} created successfully.");
    }

    public function show(int $id): \Inertia\Response
    {
        $trip = $this->tripService->find($id);
        return Inertia::render('Admin/Trips/Show', compact('trip'));
    }

    public function complete(Request $request, int $id): RedirectResponse
    {
        $this->tripService->completeTrip($id, $request->get('attendance', []));

        return redirect()->route('admin.trips.show', $id)
            ->with('success', 'Trip completed and sessions updated.');
    }
}
