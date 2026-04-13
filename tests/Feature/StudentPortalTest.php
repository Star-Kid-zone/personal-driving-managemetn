<?php

namespace Tests\Feature;

use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class StudentPortalTest extends TestCase
{
    use RefreshDatabase;

    public function test_portal_entry_page_is_accessible(): void
    {
        $response = $this->get(route('student.portal.entry'));
        $response->assertStatus(200);
    }

    public function test_student_can_access_portal_with_student_id(): void
    {
        $student = $this->makeStudent();

        $response = $this->post(route('student.portal.access'), [
            'identifier' => $student->student_id,
        ]);

        $response->assertRedirect(route('student.portal.dashboard'));
        $this->assertEquals($student->id, session('student_portal_id'));
    }

    public function test_student_can_access_portal_with_access_token(): void
    {
        $student = $this->makeStudent();

        $response = $this->post(route('student.portal.access'), [
            'identifier' => $student->access_token,
        ]);

        $response->assertRedirect(route('student.portal.dashboard'));
    }

    public function test_invalid_id_shows_error(): void
    {
        $response = $this->post(route('student.portal.access'), [
            'identifier' => 'DM-9999-9999',
        ]);

        $response->assertSessionHasErrors('identifier');
    }

    public function test_dashboard_redirects_without_session(): void
    {
        $response = $this->get(route('student.portal.dashboard'));
        $response->assertRedirect(route('student.portal.entry'));
    }

    public function test_authenticated_student_can_see_dashboard(): void
    {
        $student = $this->makeStudent();

        $response = $this->withSession(['student_portal_id' => $student->id])
            ->get(route('student.portal.dashboard'));

        $response->assertStatus(200);
    }

    public function test_logout_clears_session(): void
    {
        $student = $this->makeStudent();

        $response = $this->withSession(['student_portal_id' => $student->id])
            ->get(route('student.portal.logout'));

        $response->assertRedirect(route('student.portal.entry'));
        $this->assertNull(session('student_portal_id'));
    }

    private function makeStudent(): Student
    {
        return Student::create([
            'student_id'         => 'DM-'.now()->year.'-'.rand(1000,9999),
            'name'               => 'Portal Test Student',
            'phone'              => '9'.rand(100000000,999999999),
            'address'            => '12 Portal Street, Chennai',
            'date_of_birth'      => '2001-03-20',
            'gender'             => 'female',
            'vehicle_type'       => 'bike',
            'total_sessions'     => 15,
            'completed_sessions' => 5,
            'enrollment_date'    => now()->toDateString(),
            'status'             => 'active',
            'access_token'       => Str::random(32).'-'.time(),
        ]);
    }
}
