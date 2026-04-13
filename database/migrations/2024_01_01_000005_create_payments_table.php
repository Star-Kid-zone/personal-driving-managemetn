<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('payment_number')->unique();
            $table->decimal('total_fee', 10, 2);
            $table->decimal('amount_paid', 10, 2)->default(0);
            // balance_due computed via accessor: total_fee - amount_paid
            $table->enum('payment_status', ['pending', 'partial', 'paid'])->default('pending');
            $table->enum('payment_type', ['full', 'half', 'partial'])->default('full');
            $table->enum('payment_mode', ['cash', 'upi', 'card', 'bank_transfer', 'cheque'])->default('cash');
            $table->string('transaction_id')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('received_by')->nullable()->constrained('users')->nullOnDelete();
            $table->date('due_date')->nullable();
            $table->timestamps();
        });

        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->enum('payment_mode', ['cash', 'upi', 'card', 'bank_transfer', 'cheque'])->default('cash');
            $table->string('transaction_id')->nullable();
            $table->string('reference_number')->nullable();
            $table->date('paid_on');
            $table->text('notes')->nullable();
            $table->foreignId('received_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
        Schema::dropIfExists('payments');
    }
};
