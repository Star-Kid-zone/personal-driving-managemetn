<?php

namespace App\Services;

use App\Models\Student;
use App\Repositories\Interfaces\StudentRepositoryInterface;
use App\Repositories\Interfaces\PaymentRepositoryInterface;
use App\Repositories\Interfaces\LlrRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class StudentService
{
    public function __construct(
        private StudentRepositoryInterface $studentRepo,
        private PaymentRepositoryInterface $paymentRepo,
        private LlrRepositoryInterface     $llrRepo,
        private ImageService               $imageService,
    ) {}

    public function list(array $filters = []): LengthAwarePaginator
    {
        return $this->studentRepo->all($filters);
    }

    public function findById(int $id): Student
    {
        return $this->studentRepo->find($id);
    }

    public function findByStudentId(string $studentId): ?Student
    {
        return $this->studentRepo->findByStudentId($studentId);
    }

    public function findByAccessToken(string $token): ?Student
    {
        return $this->studentRepo->findByAccessToken($token);
    }

    public function enroll(array $data): Student
    {
        return DB::transaction(function () use ($data) {
            // Handle profile photo upload
            if (!empty($data['profile_photo']) && is_object($data['profile_photo'])) {
                $data['profile_photo'] = $this->imageService->upload(
                    $data['profile_photo'], 'students/photos'
                );
            }

            // Handle document uploads
            foreach (['aadhaar_document', 'address_proof', 'age_proof'] as $doc) {
                if (!empty($data[$doc]) && is_object($data[$doc])) {
                    $data[$doc] = $this->imageService->upload($data[$doc], 'students/documents');
                }
            }

            $data['student_id']      = $this->studentRepo->generateStudentId();
            $data['enrollment_date'] = $data['enrollment_date'] ?? now()->toDateString();

            $student = $this->studentRepo->create($data);

            // Create payment record
            if (!empty($data['total_fee'])) {
                $amountPaid = (float) ($data['amount_paid'] ?? 0);
                $totalFee   = (float) $data['total_fee'];
                $payStatus  = $amountPaid >= $totalFee ? 'paid' : ($amountPaid > 0 ? 'partial' : 'pending');

                $payment = $this->paymentRepo->create([
                    'student_id'     => $student->id,
                    'payment_number' => $this->paymentRepo->generatePaymentNumber(),
                    'total_fee'      => $totalFee,
                    'amount_paid'    => $amountPaid,
                    'payment_type'   => $data['payment_type']   ?? 'full',
                    'payment_mode'   => $data['payment_mode']   ?? 'cash',
                    'payment_status' => $payStatus,
                    'received_by'    => auth()->id(),
                ]);

                if ($amountPaid > 0) {
                    $this->paymentRepo->addTransaction([
                        'payment_id'   => $payment->id,
                        'student_id'   => $student->id,
                        'amount'       => $amountPaid,
                        'payment_mode' => $data['payment_mode'] ?? 'cash',
                        'paid_on'      => now()->toDateString(),
                        'received_by'  => auth()->id(),
                        'notes'        => 'Initial payment on enrollment',
                    ]);
                }
            }

            // Create LLR record skeleton
            $this->llrRepo->createOrUpdate($student->id, [
                'llr_status' => 'not_applied',
                'dl_status'  => 'not_applied',
                'managed_by' => auth()->id(),
            ]);

            return $student->fresh(['payment', 'llrRecord']);
        });
    }

    public function update(int $id, array $data): Student
    {
        return DB::transaction(function () use ($id, $data) {
            if (!empty($data['profile_photo']) && is_object($data['profile_photo'])) {
                $data['profile_photo'] = $this->imageService->upload(
                    $data['profile_photo'], 'students/photos'
                );
            }
            return $this->studentRepo->update($id, $data);
        });
    }

    public function delete(int $id): bool
    {
        return $this->studentRepo->delete($id);
    }

    public function getDashboardStats(): array
    {
        return $this->studentRepo->getDashboardStats();
    }

    public function getIncompleteStudents(): Collection
    {
        return $this->studentRepo->getIncompleteStudents();
    }
}
