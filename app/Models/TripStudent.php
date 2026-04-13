<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TripStudent extends Model
{
    protected $table = 'trip_students';

    protected $fillable = [
        'trip_id', 'student_id', 'attended', 'session_number',
        'performance_notes', 'skill_rating',
    ];

    protected function casts(): array
    {
        return ['attended' => 'boolean'];
    }

    public function trip(): BelongsTo
    {
        return $this->belongsTo(Trip::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
