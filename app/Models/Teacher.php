<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Teacher extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'employee_id', 'license_number', 'license_expiry',
        'address', 'date_of_birth', 'gender', 'specialization',
        'monthly_salary', 'joined_date', 'emergency_contact',
        'aadhaar_number', 'aadhaar_document', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'license_expiry' => 'date',
            'date_of_birth' => 'date',
            'joined_date' => 'date',
            'is_active' => 'boolean',
            'monthly_salary' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function trips(): HasMany
    {
        return $this->hasMany(Trip::class);
    }

    public function getActiveStudentsCountAttribute(): int
    {
        return $this->students()->active()->count();
    }

    public function getTotalTripsCountAttribute(): int
    {
        return $this->trips()->where('status', 'completed')->count();
    }
}
