<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $teachers = Teacher::with('user')
            ->withCount(['students', 'trips'])
            ->latest()->paginate(15);
        return Inertia::render('Admin/Teachers/Index', compact('teachers'));
    }

    public function create(): \Inertia\Response
    {
        return Inertia::render('Admin/Teachers/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:100',
            'email'          => 'required|email|unique:users',
            'phone'          => 'required|string|max:15',
            'password'       => 'required|min:8',
            'specialization' => 'required|in:bike,car,both',
            'address'        => 'nullable|string',
            'date_of_birth'  => 'nullable|date',
            'gender'         => 'nullable|in:male,female,other',
        ]);

        $user = User::create([
            'name'      => $validated['name'],
            'email'     => $validated['email'],
            'phone'     => $validated['phone'],
            'password'  => Hash::make($validated['password']),
            'role'      => 'teacher',
            'is_active' => true,
        ]);

        $count = Teacher::count() + 1;
        Teacher::create([
            'user_id'        => $user->id,
            'employee_id'    => sprintf('TCH-%04d', $count),
            'specialization' => $validated['specialization'],
            'address'        => $validated['address'] ?? null,
            'date_of_birth'  => $validated['date_of_birth'] ?? null,
            'gender'         => $validated['gender'] ?? null,
            'is_active'      => true,
        ]);

        return redirect()->route('admin.teachers.index')
            ->with('success', "Teacher {$user->name} added successfully. Login: {$user->email}");
    }

    public function show(Teacher $teacher): \Inertia\Response
    {
        $teacher->load(['user', 'students.payment', 'trips' => fn($q) => $q->latest()->limit(10)]);
        $teacher->loadCount([
            'students',
            'trips',
            'students as active_students_count' => fn($q) => $q->where('status', 'active'),
        ]);
        return Inertia::render('Admin/Teachers/Show', compact('teacher'));
    }

    public function edit(Teacher $teacher): \Inertia\Response
    {
        $teacher->load('user');
        return Inertia::render('Admin/Teachers/Edit', compact('teacher'));
    }

    public function update(Request $request, Teacher $teacher): RedirectResponse
    {
        $validated = $request->validate([
            'name'           => 'nullable|string|max:100',
            'phone'          => 'nullable|string|max:15',
            'specialization' => 'nullable|in:bike,car,both',
            'is_active'      => 'nullable|boolean',
        ]);

        $teacher->update(array_filter([
            'specialization' => $validated['specialization'] ?? null,
            'is_active'      => $validated['is_active'] ?? null,
        ], fn($v) => !is_null($v)));

        if (!empty($validated['name']) || !empty($validated['phone'])) {
            $userUpdate = [];
            if (!empty($validated['name']))  $userUpdate['name']  = $validated['name'];
            if (!empty($validated['phone'])) $userUpdate['phone'] = $validated['phone'];
            $teacher->user->update($userUpdate);
        }

        return redirect()->route('admin.teachers.show', $teacher->id)
            ->with('success', 'Teacher updated successfully.');
    }

    public function destroy(Teacher $teacher): RedirectResponse
    {
        $teacher->update(['is_active' => false]);
        $teacher->user->update(['is_active' => false]);

        return redirect()->route('admin.teachers.index')
            ->with('success', 'Teacher deactivated successfully.');
    }
}
