<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Student;
use App\Models\LlrRecord;
use App\Services\LlrService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;
use Tests\TestCase;

class LlrTamilNaduRuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_dl_eligible_date_is_30_days_after_llr_issued(): void
    {
        $student = $this->createStudentWithLlr('2024-01-01');

        $this->assertEquals('2024-01-31', $student->llrRecord->dl_eligible_date);
    }

    public function test_dl_not_eligible_before_30_days(): void
    {
        Carbon::setTestNow('2024-01-15');
        $student = $this->createStudentWithLlr('2024-01-01');

        $this->assertFalse($student->llrRecord->fresh()->dl_eligible);
        $this->assertEquals(16, $student->llrRecord->fresh()->days_until_dl_eligible);
    }

    public function test_dl_eligible_after_30_days(): void
    {
        Carbon::setTestNow('2024-02-05');
        $student = $this->createStudentWithLlr('2024-01-01');

        $record = $student->llrRecord->fresh();
        $this->assertTrue($record->dl_eligible);
        $this->assertEquals(0, $record->days_until_dl_eligible);

        Carbon::setTestNow();
    }

    public function test_dl_status_moves_to_documents_pending_when_eligible(): void
    {
        Carbon::setTestNow('2024-02-05');

        $student = $this->createStudentWithLlr('2024-01-01', 'waiting_period');
        $record  = $student->llrRecord->fresh();

        $this->assertEquals('documents_pending', $record->dl_status);

        Carbon::setTestNow();
    }

    public function test_daily_scheduler_checks_all_students(): void
    {
        Carbon::setTestNow('2024-02-05');

        // Create multiple students with LLR issued 31+ days ago
        for ($i = 0; $i < 3; $i++) {
            $this->createStudentWithLlr('2024-01-01', 'not_applied');
        }

        $service = app(LlrService::class);
        $service->runDailyEligibilityCheck();

        $this->assertEquals(3, LlrRecord::where('dl_eligible', true)->count());

        Carbon::setTestNow();
    }

    private function createStudentWithLlr(string $llrIssuedDate, string $dlStatus = 'not_applied'): Student
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $student = Student::create([
            'student_id'      => 'DM-TEST-'.rand(1000, 9999),
            'name'            => 'Test Student',
            'phone'           => '9'.rand(100000000, 999999999),
            'address'         => 'Test Address',
            'date_of_birth'   => '2000-01-01',
            'gender'          => 'male',
            'vehicle_type'    => 'car',
            'total_sessions'  => 20,
            'completed_sessions' => 0,
            'enrollment_date' => '2024-01-01',
            'status'          => 'active',
            'access_token'    => \Illuminate\Support\Str::random(32),
        ]);

        $llrService = app(LlrService::class);
        $this->actingAs($admin);
        $llrService->updateLlrRecord($student->id, [
            'llr_status'      => 'passed',
            'llr_issued_date' => $llrIssuedDate,
            'dl_status'       => $dlStatus,
        ]);

        return $student->fresh(['llrRecord']);
    }
}
