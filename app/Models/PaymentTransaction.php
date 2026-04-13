<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentTransaction extends Model
{
    protected $fillable = [
        'payment_id', 'student_id', 'amount', 'payment_mode',
        'transaction_id', 'reference_number', 'paid_on', 'notes', 'received_by',
    ];

    protected function casts(): array
    {
        return [
            'paid_on' => 'date',
            'amount' => 'decimal:2',
        ];
    }

    public function payment(): BelongsTo { return $this->belongsTo(Payment::class); }
    public function student(): BelongsTo { return $this->belongsTo(Student::class); }
    public function receivedBy(): BelongsTo { return $this->belongsTo(User::class, 'received_by'); }
}
