<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id', 'payment_number', 'total_fee', 'amount_paid',
        'payment_status', 'payment_type', 'payment_mode', 'transaction_id',
        'notes', 'received_by', 'due_date',
    ];

    protected $appends = ['balance_due'];

    protected function casts(): array
    {
        return [
            'total_fee'   => 'decimal:2',
            'amount_paid' => 'decimal:2',
            'due_date'    => 'date',
        ];
    }

    public function getBalanceDueAttribute(): float
    {
        return max(0, (float)$this->total_fee - (float)$this->amount_paid);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function receivedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    public function updateStatus(): void
    {
        if ((float)$this->amount_paid >= (float)$this->total_fee) {
            $this->payment_status = 'paid';
        } elseif ((float)$this->amount_paid > 0) {
            $this->payment_status = 'partial';
        } else {
            $this->payment_status = 'pending';
        }
        $this->save();
    }
}
