<?php

namespace Tests\Unit;

use App\Models\Payment;
use App\Models\Student;
use App\Services\PaymentService;
use App\Repositories\PaymentRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_payment_status_updates_to_paid_when_fully_paid(): void
    {
        $student = $this->makeStudent();
        $payment = Payment::create([
            'student_id'     => $student->id,
            'payment_number' => 'PAY-TEST-001',
            'total_fee'      => 4000,
            'amount_paid'    => 0,
            'payment_status' => 'pending',
            'payment_type'   => 'full',
            'payment_mode'   => 'cash',
        ]);

        $payment->increment('amount_paid', 4000);
        $payment->updateStatus();

        $this->assertEquals('paid', $payment->fresh()->payment_status);
    }

    public function test_payment_status_is_partial_when_partially_paid(): void
    {
        $student = $this->makeStudent();
        $payment = Payment::create([
            'student_id'     => $student->id,
            'payment_number' => 'PAY-TEST-002',
            'total_fee'      => 4000,
            'amount_paid'    => 2000,
            'payment_status' => 'pending',
            'payment_type'   => 'partial',
            'payment_mode'   => 'cash',
        ]);

        $payment->updateStatus();

        $this->assertEquals('partial', $payment->fresh()->payment_status);
    }

    public function test_balance_due_computed_correctly(): void
    {
        $student = $this->makeStudent();
        $payment = Payment::create([
            'student_id'     => $student->id,
            'payment_number' => 'PAY-TEST-003',
            'total_fee'      => 5000,
            'amount_paid'    => 3000,
            'payment_status' => 'partial',
            'payment_type'   => 'partial',
            'payment_mode'   => 'upi',
        ]);

        // balance_due is a stored/computed column; test via accessor
        $this->assertEquals(2000.0, $payment->getBalanceDueAttribute());
    }

    private function makeStudent(): Student
    {
        return Student::create([
            'student_id'      => 'DM-UNIT-'.rand(1,999),
            'name'            => 'Unit Test Student',
            'phone'           => '9'.rand(100000000,999999999),
            'address'         => 'Unit Test Street',
            'date_of_birth'   => '1998-01-01',
            'gender'          => 'male',
            'vehicle_type'    => 'car',
            'total_sessions'  => 20,
            'completed_sessions' => 0,
            'enrollment_date' => now()->toDateString(),
            'status'          => 'active',
            'access_token'    => \Illuminate\Support\Str::random(32),
        ]);
    }
}
