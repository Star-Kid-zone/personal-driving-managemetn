<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    protected $fillable = [
        'invoice_number', 'student_id', 'payment_id',
        'subtotal', 'discount', 'tax', 'total', 'amount_paid',
        'invoice_date', 'due_date', 'status', 'line_items', 'notes',
        'pdf_path', 'created_by',
    ];

    protected $appends = ['balance'];

    protected function casts(): array
    {
        return [
            'invoice_date' => 'date',
            'due_date'     => 'date',
            'line_items'   => 'array',
            'subtotal'     => 'decimal:2',
            'discount'     => 'decimal:2',
            'tax'          => 'decimal:2',
            'total'        => 'decimal:2',
            'amount_paid'  => 'decimal:2',
        ];
    }

    public function getBalanceAttribute(): float
    {
        return max(0, (float)$this->total - (float)$this->amount_paid);
    }

    public function student(): BelongsTo { return $this->belongsTo(Student::class); }
    public function payment(): BelongsTo { return $this->belongsTo(Payment::class); }
    public function createdBy(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }

    public function getPdfUrlAttribute(): ?string
    {
        return $this->pdf_path ? \Storage::disk(config('filesystems.default', 'public'))->url($this->pdf_path) : null;
    }
}
