<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'phone', 'profile_photo', 'is_active',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_active'         => 'boolean',
        ];
    }

    public function isAdmin(): bool { return $this->role === 'admin'; }
    public function isTeacher(): bool { return $this->role === 'teacher'; }

    public function teacher(): HasOne
    {
        return $this->hasOne(Teacher::class);
    }

    public function getProfilePhotoUrlAttribute(): string
    {
        if ($this->profile_photo) {
            return \Storage::disk(config('filesystems.default', 'public'))->url($this->profile_photo);
        }
        return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&color=D4AF37&background=000666';
    }
}
