<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id', 'name', 'phone', 'alt_phone', 'email', 'address', 'city', 'pincode',
        'date_of_birth', 'gender', 'vehicle_type', 'aadhaar_number', 'profile_photo',
        'aadhaar_document', 'address_proof', 'age_proof', 'photos',
        'total_sessions', 'completed_sessions',
        'enrollment_date', 'expected_completion_date',
        'status', 'access_token',
    ];

    protected $appends = ['age'];

    protected function casts(): array
    {
        return [
            'date_of_birth'           => 'date',
            'enrollment_date'         => 'date',
            'expected_completion_date'=> 'date',
            'photos'                  => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Student $student) {
            if (empty($student->access_token)) {
                $student->access_token = Str::random(32) . '-' . time();
            }
        });
    }

    // Computed accessors (replaces storedAs columns)
    public function getAgeAttribute(): int
    {
        return $this->date_of_birth ? $this->date_of_birth->diffInYears(now()) : 0;
    }

    public function getRemainingSessionsAttribute(): int
    {
        return max(0, $this->total_sessions - $this->completed_sessions);
    }

    public function getProgressPercentageAttribute(): float
    {
        if ($this->total_sessions === 0) return 0;
        return round(($this->completed_sessions / $this->total_sessions) * 100, 1);
    }

    public function getProfilePhotoUrlAttribute(): string
    {
        if ($this->profile_photo) {
            return \Storage::disk(config('filesystems.default', 'public'))->url($this->profile_photo);
        }
        return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&color=D4AF37&background=000666';
    }

    public function getDlEligibleAttribute(): bool
    {
        return $this->llrRecord?->dl_eligible ?? false;
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function paymentTransactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    public function trips(): HasMany
    {
        return $this->hasMany(TripStudent::class);
    }

    public function llrRecord(): HasOne
    {
        return $this->hasOne(LlrRecord::class);
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    public function documents(): MorphMany
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    public function notifications(): MorphMany
    {
        return $this->morphMany(Notification::class, 'notifiable');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeWithPendingLlr($query)
    {
        return $query->whereHas('llrRecord', function ($q) {
            $q->where('llr_status', 'not_applied');
        });
    }
}
