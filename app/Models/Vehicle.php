<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'registration_number', 'make', 'model', 'year', 'type', 'color',
        'fuel_type', 'seating_capacity', 'insurance_expiry', 'pollution_expiry',
        'fitness_expiry', 'vehicle_photo', 'status', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'insurance_expiry' => 'date',
            'pollution_expiry' => 'date',
            'fitness_expiry'   => 'date',
        ];
    }

    public function trips(): HasMany { return $this->hasMany(Trip::class); }
    public function students(): HasMany { return $this->hasMany(Student::class); }

    public function getVehiclePhotoUrlAttribute(): string
    {
        if ($this->vehicle_photo) {
            return \Storage::disk(config('filesystems.default', 'public'))->url($this->vehicle_photo);
        }
        return "https://picsum.photos/seed/{$this->type}{$this->id}/400/300";
    }

    public function getIsInsuranceExpiringAttribute(): bool
    {
        return $this->insurance_expiry && $this->insurance_expiry->diffInDays(now()) <= 30;
    }

    public function getDisplayNameAttribute(): string
    {
        return "{$this->make} {$this->model} ({$this->registration_number})";
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
