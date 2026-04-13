<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Document extends Model
{
    protected $fillable = [
        'name', 'type', 'file_path', 'file_name', 'mime_type', 'file_size',
        'is_verified', 'expiry_date', 'notes', 'uploaded_by',
    ];

    protected function casts(): array
    {
        return [
            'expiry_date' => 'date',
            'is_verified' => 'boolean',
        ];
    }

    public function documentable(): MorphTo { return $this->morphTo(); }
    public function uploadedBy(): BelongsTo { return $this->belongsTo(User::class, 'uploaded_by'); }

    public function getFileUrlAttribute(): string
    {
        return \Storage::disk(config('filesystems.default', 'public'))->url($this->file_path);
    }
}
