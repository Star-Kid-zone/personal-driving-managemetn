<?php

namespace App\Repositories;

use App\Models\LlrRecord;
use App\Repositories\Interfaces\LlrRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class LlrRepository implements LlrRepositoryInterface
{
    public function __construct(private LlrRecord $model) {}

    public function findByStudent(int $studentId): ?Model
    {
        return $this->model->where('student_id', $studentId)->first();
    }

    public function createOrUpdate(int $studentId, array $data): Model
    {
        $record = $this->model->updateOrCreate(
            ['student_id' => $studentId],
            $data
        );
        $record->checkAndSetDlEligibility();
        return $record->fresh();
    }

    public function getStudentsAwaitingLlr(): Collection
    {
        return $this->model
            ->whereIn('llr_status', ['not_applied', 'documents_pending'])
            ->with(['student', 'student.teacher.user'])
            ->get();
    }

    public function getStudentsDlEligible(): Collection
    {
        return $this->model
            ->where('dl_eligible', true)
            ->whereIn('dl_status', ['waiting_period', 'documents_pending'])
            ->with(['student', 'student.teacher.user'])
            ->get();
    }

    public function getUpcomingTests(): Collection
    {
        return $this->model
            ->where(function ($q) {
                $q->where(fn($q2) => $q2->whereNotNull('llr_test_date')->where('llr_test_date', '>=', now()))
                  ->orWhere(fn($q2) => $q2->whereNotNull('dl_test_date')->where('dl_test_date', '>=', now()));
            })
            ->with(['student'])
            ->orderByRaw('COALESCE(llr_test_date, dl_test_date)')
            ->limit(20)
            ->get();
    }

    public function checkDlEligibility(): void
    {
        $records = $this->model
            ->whereNotNull('llr_issued_date')
            ->where('dl_eligible', false)
            ->get();

        foreach ($records as $record) {
            $record->checkAndSetDlEligibility();
        }
    }
}
