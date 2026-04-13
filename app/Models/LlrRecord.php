<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class LlrRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'llr_status', 'llr_applied_date', 'llr_test_date', 'llr_issued_date',
        'llr_expiry_date', 'llr_number', 'llr_document',
        'dl_eligible_date', 'dl_eligible',
        'dl_status', 'dl_applied_date', 'dl_test_date', 'dl_issued_date',
        'dl_number', 'dl_document', 'dl_expiry_date',
        'rto_office', 'application_number', 'notes', 'managed_by',
    ];

    protected function casts(): array
    {
        return [
            'llr_applied_date' => 'date',
            'llr_test_date'    => 'date',
            'llr_issued_date'  => 'date',
            'llr_expiry_date'  => 'date',
            'dl_eligible_date' => 'date',
            'dl_eligible'      => 'boolean',
            'dl_applied_date'  => 'date',
            'dl_test_date'     => 'date',
            'dl_issued_date'   => 'date',
            'dl_expiry_date'   => 'date',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function managedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'managed_by');
    }

    /**
     * Tamil Nadu rule: DL eligible 30 days after LLR issued.
     */
    public function checkAndSetDlEligibility(): void
    {
        if ($this->llr_issued_date && !$this->dl_eligible) {
            $eligibleDate = $this->llr_issued_date->copy()->addDays(30);
            $this->dl_eligible_date = $eligibleDate->toDateString();

            if (now()->gte($eligibleDate)) {
                $this->dl_eligible = true;
                if ($this->dl_status === 'waiting_period' || $this->dl_status === 'not_applied') {
                    $this->dl_status = 'documents_pending';
                }
            }
            $this->save();
        }
    }

    public function getDaysUntilDlEligibleAttribute(): int
    {
        if (!$this->dl_eligible_date) return 0;
        if ($this->dl_eligible) return 0;
        $diff = (int) now()->diffInDays($this->dl_eligible_date, false);
        return max(0, $diff);
    }

    public function getLlrStatusLabelAttribute(): string
    {
        return match ($this->llr_status) {
            'not_applied'       => 'Not Applied',
            'documents_pending' => 'Documents Pending',
            'applied'           => 'Applied',
            'test_scheduled'    => 'Test Scheduled',
            'passed'            => 'Passed',
            'failed'            => 'Failed',
            'expired'           => 'Expired',
            default             => ucfirst(str_replace('_', ' ', $this->llr_status ?? '')),
        };
    }

    public function getDlStatusLabelAttribute(): string
    {
        return match ($this->dl_status) {
            'not_applied'       => 'Not Applied',
            'waiting_period'    => 'Waiting Period (30 days)',
            'documents_pending' => 'Documents Pending',
            'applied'           => 'Applied',
            'test_scheduled'    => 'Test Scheduled',
            'passed'            => 'Passed',
            'failed'            => 'Failed',
            'issued'            => 'Issued',
            default             => ucfirst(str_replace('_', ' ', $this->dl_status ?? '')),
        };
    }
}
