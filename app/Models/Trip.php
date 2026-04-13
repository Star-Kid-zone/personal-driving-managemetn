<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Trip extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'trip_number', 'teacher_id', 'vehicle_id', 'trip_date',
        'start_time', 'end_time', 'vehicle_type', 'route_description',
        'distance_km', 'status', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'trip_date' => 'date',
        ];
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function tripStudents(): HasMany
    {
        return $this->hasMany(TripStudent::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'trip_students')
            ->withPivot(['attended', 'session_number', 'performance_notes', 'skill_rating'])
            ->withTimestamps();
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeToday($query)
    {
        return $query->where('trip_date', today());
    }

    public function scopeUpcoming($query)
    {
        return $query->where('trip_date', '>=', today())->orderBy('trip_date')->orderBy('start_time');
    }
}
