<?php

namespace App\Services;

use App\Models\LlrRecord;
use App\Repositories\Interfaces\LlrRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Carbon\Carbon;

class LlrService
{
    public function __construct(private LlrRepositoryInterface $llrRepo) {}

    public function getByStudent(int $studentId): ?LlrRecord
    {
        return $this->llrRepo->findByStudent($studentId);
    }

    public function updateLlrRecord(int $studentId, array $data): LlrRecord
    {
        // Tamil Nadu rule: when LLR is issued (status=passed), set DL eligibility date
        if (!empty($data['llr_issued_date']) && !empty($data['llr_status']) && $data['llr_status'] === 'passed') {
            $issuedDate     = Carbon::parse($data['llr_issued_date']);
            $eligibleDate   = $issuedDate->copy()->addDays(30);
            $data['dl_eligible_date'] = $eligibleDate->toDateString();
            $data['dl_eligible']      = now()->gte($eligibleDate);

            // If 30 days not yet passed, set to waiting_period
            if (!$data['dl_eligible'] && empty($data['dl_status'])) {
                $data['dl_status'] = 'waiting_period';
            }
        }

        $data['managed_by'] = auth()->id();
        return $this->llrRepo->createOrUpdate($studentId, $data);
    }

    public function getStudentsAwaitingLlr(): Collection
    {
        return $this->llrRepo->getStudentsAwaitingLlr();
    }

    public function getDlEligibleStudents(): Collection
    {
        return $this->llrRepo->getStudentsDlEligible();
    }

    public function getUpcomingTests(): Collection
    {
        return $this->llrRepo->getUpcomingTests();
    }

    public function runDailyEligibilityCheck(): void
    {
        $this->llrRepo->checkDlEligibility();
    }
}
