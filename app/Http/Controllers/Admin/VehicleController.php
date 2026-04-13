<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class VehicleController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $vehicles = Vehicle::withCount(['students', 'trips'])
            ->latest()->paginate(15);
        return Inertia::render('Admin/Vehicles/Index', compact('vehicles'));
    }

    public function create(): \Inertia\Response
    {
        return Inertia::render('Admin/Vehicles/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'registration_number' => 'required|unique:vehicles',
            'make'                => 'required|string',
            'model'               => 'required|string',
            'year'                => 'required|integer|min:2000|max:'.(date('Y') + 1),
            'type'                => 'required|in:bike,car',
            'color'               => 'nullable|string',
            'fuel_type'           => 'nullable|string',
            'insurance_expiry'    => 'nullable|date',
            'pollution_expiry'    => 'nullable|date',
            'fitness_expiry'      => 'nullable|date',
            'chassis_number'      => 'nullable|string',
            'engine_number'       => 'nullable|string',
        ]);
        Vehicle::create($validated);
        return redirect()->route('admin.vehicles.index')
            ->with('success', 'Vehicle registered successfully.');
    }

    public function show(Vehicle $vehicle): \Inertia\Response
    {
        return Inertia::render('Admin/Vehicles/Edit', compact('vehicle'));
    }

    public function edit(Vehicle $vehicle): \Inertia\Response
    {
        return Inertia::render('Admin/Vehicles/Edit', compact('vehicle'));
    }

    public function update(Request $request, Vehicle $vehicle): RedirectResponse
    {
        $vehicle->update($request->validate([
            'status'           => 'nullable|in:active,maintenance,inactive',
            'insurance_expiry' => 'nullable|date',
            'pollution_expiry' => 'nullable|date',
            'fitness_expiry'   => 'nullable|date',
            'notes'            => 'nullable|string',
        ]));
        return redirect()->route('admin.vehicles.index')
            ->with('success', 'Vehicle updated.');
    }

    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        $vehicle->update(['status' => 'inactive']);
        return redirect()->route('admin.vehicles.index')
            ->with('success', 'Vehicle deactivated.');
    }
}
