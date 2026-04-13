<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Teacher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentEnrollmentTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private Teacher $teacher;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        $teacherUser = User::factory()->create(['role' => 'teacher', 'is_active' => true]);
        $this->teacher = Teacher::create([
            'user_id'        => $teacherUser->id,
            'employee_id'    => 'TCH-0001',
            'specialization' => 'both',
            'is_active'      => true,
        ]);
    }

    public function test_admin_can_view_students_page(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.students.index'));
        $response->assertStatus(200);
    }

    public function test_admin_can_enroll_a_student(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.students.store'), [
            'name'          => 'Test Student',
            'phone'         => '9876543210',
            'address'       => '123 Test Street, Chennai',
            'date_of_birth' => '2000-01-01',
            'gender'        => 'male',
            'vehicle_type'  => 'car',
            'total_sessions'=> 20,
            'enrollment_date'=> now()->toDateString(),
            'total_fee'     => 4000,
            'amount_paid'   => 2000,
            'payment_type'  => 'partial',
            'payment_mode'  => 'cash',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('students', ['phone' => '9876543210']);
        $this->assertDatabaseHas('payments', ['amount_paid' => 2000]);
        $this->assertDatabaseHas('llr_records', ['llr_status' => 'not_applied']);
    }

    public function test_student_id_is_auto_generated(): void
    {
        $this->actingAs($this->admin)->post(route('admin.students.store'), [
            'name'          => 'Auto ID Student',
            'phone'         => '9111111111',
            'address'       => '1 Test Street',
            'date_of_birth' => '1999-05-15',
            'gender'        => 'female',
            'vehicle_type'  => 'bike',
            'total_sessions'=> 15,
            'enrollment_date'=> now()->toDateString(),
            'total_fee'     => 2500,
            'amount_paid'   => 0,
            'payment_type'  => 'full',
            'payment_mode'  => 'cash',
        ]);

        $this->assertDatabaseHas('students', [
            'phone'      => '9111111111',
            'student_id' => 'DM-'.now()->year.'-0001',
        ]);
    }

    public function test_teacher_can_only_see_own_students(): void
    {
        $teacherUser = User::find($this->teacher->user_id);
        $response = $this->actingAs($teacherUser)->get(route('teacher.students.index'));
        $response->assertStatus(200);
    }

    public function test_role_middleware_blocks_teacher_from_admin_routes(): void
    {
        $teacherUser = User::find($this->teacher->user_id);
        $response = $this->actingAs($teacherUser)->get(route('admin.dashboard'));
        $response->assertStatus(403);
    }
}
