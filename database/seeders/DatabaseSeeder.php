<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Teacher;
use App\Models\Vehicle;
use App\Models\Student;
use App\Models\Payment;
use App\Models\PaymentTransaction;
use App\Models\LlrRecord;
use App\Models\Trip;
use App\Models\TripStudent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin ─────────────────────────────────────────────────────────
        $admin = User::create([
            'name'      => 'Vimal Kumar Admin',
            'email'     => 'admin@drivemaster.in',
            'password'  => Hash::make('Admin@123'),
            'role'      => 'admin',
            'phone'     => '9876543210',
            'is_active' => true,
        ]);

        // ── Teachers ──────────────────────────────────────────────────────
        $teacherData = [
            ['name' => 'Rajesh Murugan',  'phone' => '9876543211', 'spec' => 'both',  'email' => 'rajesh.murugan@drivemaster.in'],
            ['name' => 'Selvam Krishnan', 'phone' => '9876543212', 'spec' => 'car',   'email' => 'selvam.krishnan@drivemaster.in'],
            ['name' => 'Priya Devi',      'phone' => '9876543213', 'spec' => 'bike',  'email' => 'priya.devi@drivemaster.in'],
        ];

        $teachers = [];
        foreach ($teacherData as $i => $td) {
            $user = User::create([
                'name'      => $td['name'],
                'email'     => $td['email'],
                'password'  => Hash::make('Teacher@123'),
                'role'      => 'teacher',
                'phone'     => $td['phone'],
                'is_active' => true,
            ]);

            $teachers[] = Teacher::create([
                'user_id'        => $user->id,
                'employee_id'    => sprintf('TCH-%04d', $i + 1),
                'address'        => ['123 Anna Nagar, Chennai', '45 Gandhi Road, Chennai', '78 Nehru Street, Chennai'][$i],
                'date_of_birth'  => Carbon::now()->subYears(rand(28, 45)),
                'gender'         => ($td['name'] === 'Priya Devi') ? 'female' : 'male',
                'specialization' => $td['spec'],
                'is_active'      => true,
            ]);
        }

        // ── Vehicles ──────────────────────────────────────────────────────
        $vehicleData = [
            ['reg' => 'TN58 AX 1234', 'make' => 'Maruti',  'model' => 'Alto 800',  'type' => 'car',  'color' => 'White'],
            ['reg' => 'TN58 BK 5678', 'make' => 'Maruti',  'model' => 'Swift',      'type' => 'car',  'color' => 'Silver'],
            ['reg' => 'TN58 CM 9012', 'make' => 'Honda',   'model' => 'Activa 6G',  'type' => 'bike', 'color' => 'Blue'],
            ['reg' => 'TN58 DN 3456', 'make' => 'TVS',     'model' => 'Jupiter',    'type' => 'bike', 'color' => 'Black'],
            ['reg' => 'TN58 EP 7890', 'make' => 'Hyundai', 'model' => 'i10',        'type' => 'car',  'color' => 'Red'],
        ];

        $vehicles = [];
        foreach ($vehicleData as $vd) {
            $vehicles[] = Vehicle::create([
                'registration_number' => $vd['reg'],
                'make'                => $vd['make'],
                'model'               => $vd['model'],
                'year'                => rand(2019, 2023),
                'type'                => $vd['type'],
                'color'               => $vd['color'],
                'fuel_type'           => 'petrol',
                'seating_capacity'    => ($vd['type'] === 'car') ? 5 : 2,
                'insurance_expiry'    => Carbon::now()->addMonths(rand(3, 18)),
                'pollution_expiry'    => Carbon::now()->addMonths(rand(3, 12)),
                'fitness_expiry'      => Carbon::now()->addMonths(rand(6, 24)),
                'status'              => 'active',
            ]);
        }

        // ── Students ──────────────────────────────────────────────────────
        $tamilNames = [
            ['name' => 'Arjun Selvam',     'gender' => 'male'],
            ['name' => 'Deepa Lakshmi',    'gender' => 'female'],
            ['name' => 'Karthi Murugan',   'gender' => 'male'],
            ['name' => 'Anitha Ravi',      'gender' => 'female'],
            ['name' => 'Bala Krishnan',    'gender' => 'male'],
            ['name' => 'Meena Sundaram',   'gender' => 'female'],
            ['name' => 'Suresh Kumar',     'gender' => 'male'],
            ['name' => 'Kavitha Devi',     'gender' => 'female'],
            ['name' => 'Prakash Raja',     'gender' => 'male'],
            ['name' => 'Sangeetha Priya',  'gender' => 'female'],
            ['name' => 'Murugesan P',      'gender' => 'male'],
            ['name' => 'Lalitha S',        'gender' => 'female'],
            ['name' => 'Dinesh Kumar',     'gender' => 'male'],
            ['name' => 'Revathi Nair',     'gender' => 'female'],
            ['name' => 'Senthil Nathan',   'gender' => 'male'],
            ['name' => 'Pooja Sharma',     'gender' => 'female'],
            ['name' => 'Vijay Anand',      'gender' => 'male'],
            ['name' => 'Uma Devi',         'gender' => 'female'],
            ['name' => 'Ganesh Babu',      'gender' => 'male'],
            ['name' => 'Nithya Krishnan',  'gender' => 'female'],
        ];

        $llrStatuses   = ['not_applied', 'applied', 'passed', 'passed', 'passed'];
        $areas         = ['Anna Nagar', 'T Nagar', 'Adyar', 'Velachery', 'Tambaram'];

        foreach ($tamilNames as $i => $person) {
            $vType      = ['bike', 'car', 'both'][rand(0, 2)];
            $totalSess  = rand(15, 25);
            $compSess   = rand(0, $totalSess);
            $totalFee   = $vType === 'both' ? rand(6000, 8000) : ($vType === 'car' ? rand(3500, 5000) : rand(2000, 3000));
            $amountPaid = rand(0, $totalFee);
            $enrolled   = Carbon::now()->subMonths(rand(1, 8));
            $dob        = Carbon::now()->subYears(rand(18, 40))->subMonths(rand(0, 11));

            $student = Student::create([
                'student_id'         => sprintf('DM-%d-%04d', now()->year, $i + 1),
                'name'               => $person['name'],
                'phone'              => '9' . rand(100000000, 999999999),
                'email'              => strtolower(str_replace(' ', '.', $person['name'])) . '@gmail.com',
                'address'            => rand(1, 200) . ' ' . $areas[rand(0, 4)] . ', Chennai',
                'city'               => 'Chennai',
                'pincode'            => (string) rand(600001, 600100),
                'date_of_birth'      => $dob->toDateString(),
                'gender'             => $person['gender'],
                'vehicle_type'       => $vType,
                'total_sessions'     => $totalSess,
                'completed_sessions' => $compSess,
                'enrollment_date'    => $enrolled->toDateString(),
                'status'             => ($compSess >= $totalSess) ? 'completed' : 'active',
                'access_token'       => Str::random(32) . '-' . time() . $i,
            ]);

            // Payment
            $payStatus = $amountPaid >= $totalFee ? 'paid' : ($amountPaid > 0 ? 'partial' : 'pending');
            $payment = Payment::create([
                'student_id'     => $student->id,
                'payment_number' => sprintf('PAY-%d-%04d', now()->year, $i + 1),
                'total_fee'      => $totalFee,
                'amount_paid'    => $amountPaid,
                'payment_status' => $payStatus,
                'payment_type'   => ($payStatus === 'paid') ? 'full' : ($amountPaid > 0 ? 'partial' : 'full'),
                'payment_mode'   => ['cash', 'upi', 'card'][rand(0, 2)],
                'received_by'    => $admin->id,
            ]);

            if ($amountPaid > 0) {
                PaymentTransaction::create([
                    'payment_id'   => $payment->id,
                    'student_id'   => $student->id,
                    'amount'       => $amountPaid,
                    'payment_mode' => $payment->payment_mode,
                    'paid_on'      => $enrolled->toDateString(),
                    'received_by'  => $admin->id,
                    'notes'        => 'Initial payment',
                ]);
            }

            // LLR Record
            $llrStatus     = $llrStatuses[rand(0, count($llrStatuses) - 1)];
            $llrIssuedDate = null;
            if ($llrStatus === 'passed') {
                $llrIssuedDate = $enrolled->copy()->addDays(rand(7, 30));
            }

            $dlStatus       = 'not_applied';
            $dlEligible     = false;
            $dlEligibleDate = null;

            if ($llrIssuedDate) {
                $dlEligibleDate = $llrIssuedDate->copy()->addDays(30);
                $dlEligible     = now()->gte($dlEligibleDate);
                $dlStatus       = $dlEligible ? ['documents_pending', 'applied', 'issued'][rand(0, 2)] : 'waiting_period';
            }

            LlrRecord::create([
                'student_id'       => $student->id,
                'llr_status'       => $llrStatus,
                'llr_applied_date' => ($llrStatus !== 'not_applied') ? $enrolled->copy()->addDays(5)->toDateString() : null,
                'llr_issued_date'  => $llrIssuedDate?->toDateString(),
                'llr_expiry_date'  => $llrIssuedDate?->copy()->addMonths(6)->toDateString(),
                'dl_eligible_date' => $dlEligibleDate?->toDateString(),
                'dl_eligible'      => $dlEligible,
                'dl_status'        => $dlStatus,
                'dl_issued_date'   => ($dlStatus === 'issued') ? now()->subDays(rand(1, 30))->toDateString() : null,
                'rto_office'       => 'RTO Chennai - TN58',
                'managed_by'       => $admin->id,
            ]);
        }

        // ── Trips ─────────────────────────────────────────────────────────
        $students = Student::all();
        foreach (range(1, 30) as $t) {
            $teacher  = $teachers[array_rand($teachers)];
            $vType    = ['bike', 'car'][rand(0, 1)];
            $vehicle  = collect($vehicles)->filter(fn($v) => $v->type === $vType)->first() ?? $vehicles[0];
            $tripDate = Carbon::now()->subDays(rand(0, 60));
            $status   = $tripDate->isPast() ? 'completed' : 'scheduled';

            $trip = Trip::create([
                'trip_number'  => sprintf('TRIP-%d-%04d', now()->year, $t),
                'teacher_id'   => $teacher->id,
                'vehicle_id'   => $vehicle->id,
                'trip_date'    => $tripDate->toDateString(),
                'start_time'   => ['07:00', '08:00', '09:00', '16:00', '17:00'][rand(0, 4)],
                'end_time'     => ['08:00', '09:00', '10:00', '17:00', '18:00'][rand(0, 4)],
                'vehicle_type' => $vType,
                'status'       => $status,
            ]);

            $eligible = $students->filter(fn($s) => $s->vehicle_type === $vType || $s->vehicle_type === 'both');
            $selected = $eligible->shuffle()->take(rand(1, 4));

            foreach ($selected as $student) {
                TripStudent::create([
                    'trip_id'        => $trip->id,
                    'student_id'     => $student->id,
                    'attended'       => ($status === 'completed'),
                    'session_number' => $student->completed_sessions,
                ]);
            }
        }

        $this->command->info('');
        $this->command->info('✅ DriveMaster seeded successfully!');
        $this->command->info('   Admin:   admin@drivemaster.in / Admin@123');
        $this->command->info('   Teacher: rajesh.murugan@drivemaster.in / Teacher@123');
        $this->command->info('   Portal:  /portal → enter DM-' . now()->year . '-0001');
    }
}
