<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Notification extends Model
{
    protected $fillable = [
        'notifiable_type', 'notifiable_id', 'type',
        'title', 'message', 'data', 'channel',
        'is_read', 'read_at', 'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'data'     => 'array',
            'is_read'  => 'boolean',
            'read_at'  => 'datetime',
            'sent_at'  => 'datetime',
        ];
    }

    public function notifiable(): MorphTo
    {
        return $this->morphTo();
    }

    public function markAsRead(): void
    {
        $this->update(['is_read' => true, 'read_at' => now()]);
    }

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }
}
