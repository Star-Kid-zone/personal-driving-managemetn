<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Teacher;
use App\Models\Vehicle;
use App\Models\Student;
use App\Models\Trip;
use App\Models\TripStudent;
use App\Services\TripService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TripCompletionTest extends TestCase
{
    use RefreshDatabase;

    public function test_completing_trip_decrements_student_sessions(): void
    {
        [$teacher, $vehicle, $student, $trip] = $this->setupTrip();

        $initialSessions = $student->completed_sessions;

        app(TripService::class)->completeTrip($trip->id);

        $student->refresh();
        $this->assertEquals($initialSessions + 1, $student->completed_sessions);
    }

    public function test_absent_student_sessions_not_decremented(): void
    {
        [$teacher, $vehicle, $student, $trip] = $this->setupTrip();

        // Mark absent before completing
        TripStudent::where('trip_id', $trip->id)->where('student_id', $student->id)->update(['attended' => false]);

        $initialSessions = $student->completed_sessions;
        app(TripService::class)->completeTrip($trip->id);

        $student->refresh();
        $this->assertEquals($initialSessions, $student->completed_sessions);
    }

    public function test_student_status_becomes_completed_when_all_sessions_done(): void
    {
        [$teacher, $vehicle, $student, $trip] = $this->setupTrip(totalSessions: 1, completedSessions: 0);

        app(TripService::class)->completeTrip($trip->id);

        $student->refresh();
        $this->assertEquals('completed', $student->status);
    }

    public function test_trip_status_becomes_completed(): void
    {
        [$teacher, $vehicle, $student, $trip] = $this->setupTrip();

        app(TripService::class)->completeTrip($trip->id);

        $trip->refresh();
        $this->assertEquals('completed', $trip->status);
    }

    private function setupTrip(int $totalSessions = 20, int $completedSessions = 5): array
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin);

        $teacherUser = User::factory()->create(['role' => 'teacher']);
        $teacher = Teacher::create([
            'user_id'        => $teacherUser->id,
            'employee_id'    => 'TCH-TST-001',
            'specialization' => 'car',
            'is_active'      => true,
        ]);

        $vehicle = Vehicle::create([
            'registration_number' => 'TN58 TST '.rand(1000,9999),
            'make'                => 'Test Make',
            'model'               => 'Test Model',
            'year'                => 2022,
            'type'                => 'car',
            'status'              => 'active',
        ]);

        $student = Student::create([
            'student_id'      => 'DM-TRIP-'.rand(1000,9999),
            'name'            => 'Trip Test Student',
            'phone'           => '9'.rand(100000000,999999999),
            'address'         => 'Trip Test Street',
            'date_of_birth'   => '2000-06-15',
            'gender'          => 'male',
            'vehicle_type'    => 'car',
            'total_sessions'  => $totalSessions,
            'completed_sessions' => $completedSessions,
            'teacher_id'      => $teacher->id,
            'vehicle_id'      => $vehicle->id,
            'enrollment_date' => now()->toDateString(),
            'status'          => 'active',
            'access_token'    => \Illuminate\Support\Str::random(32),
        ]);

        $trip = Trip::create([
            'trip_number'  => 'TRIP-TST-'.rand(1000,9999),
            'teacher_id'   => $teacher->id,
            'vehicle_id'   => $vehicle->id,
            'trip_date'    => now()->toDateString(),
            'start_time'   => '09:00',
            'vehicle_type' => 'car',
            'status'       => 'scheduled',
        ]);

        TripStudent::create([
            'trip_id'       => $trip->id,
            'student_id'    => $student->id,
            'attended'      => true,
            'session_number'=> $completedSessions + 1,
        ]);

        return [$teacher, $vehicle, $student, $trip];
    }
}
