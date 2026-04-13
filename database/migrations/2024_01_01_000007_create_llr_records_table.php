<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('llr_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();

            // LLR Application
            $table->enum('llr_status', [
                'not_applied',
                'documents_pending',
                'applied',
                'test_scheduled',
                'passed',
                'failed',
                'expired'
            ])->default('not_applied');
            $table->date('llr_applied_date')->nullable();
            $table->date('llr_test_date')->nullable();
            $table->date('llr_issued_date')->nullable();
            $table->date('llr_expiry_date')->nullable(); // LLR valid for 6 months
            $table->string('llr_number')->nullable();
            $table->string('llr_document')->nullable();

            // Tamil Nadu specific - 30 day waiting rule
            $table->date('dl_eligible_date')->nullable(); // llr_issued_date + 30 days
            $table->boolean('dl_eligible')->default(false);

            // DL Application
            $table->enum('dl_status', [
                'not_applied',
                'waiting_period',
                'documents_pending',
                'applied',
                'test_scheduled',
                'passed',
                'failed',
                'issued'
            ])->default('not_applied');
            $table->date('dl_applied_date')->nullable();
            $table->date('dl_test_date')->nullable();
            $table->date('dl_issued_date')->nullable();
            $table->string('dl_number')->nullable();
            $table->string('dl_document')->nullable();
            $table->date('dl_expiry_date')->nullable(); // DL valid for 20 years usually

            // RTO Office
            $table->string('rto_office')->nullable();
            $table->string('application_number')->nullable();
            $table->text('notes')->nullable();

            $table->foreignId('managed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('llr_records');
    }
};
