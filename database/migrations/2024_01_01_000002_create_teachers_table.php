<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('employee_id')->unique();
            $table->string('license_number')->nullable();
            $table->date('license_expiry')->nullable();
            $table->text('address')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->enum('specialization', ['bike', 'car', 'both'])->default('both');
            $table->decimal('monthly_salary', 10, 2)->nullable();
            $table->date('joined_date')->nullable();
            $table->string('emergency_contact')->nullable();
            $table->string('aadhaar_number', 12)->nullable();
            $table->string('aadhaar_document')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
