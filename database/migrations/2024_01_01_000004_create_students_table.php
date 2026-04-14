<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('student_id')->unique();
            $table->string('name');
            $table->string('phone', 15);
            $table->string('alt_phone', 15)->nullable();
            $table->string('email')->nullable();
            $table->text('address');
            $table->string('city')->nullable();
            $table->string('pincode', 6)->nullable();
            $table->date('date_of_birth');
            $table->enum('gender', ['male', 'female', 'other']);
            $table->enum('vehicle_type', ['bike', 'car', 'both']);
            $table->string('aadhaar_number', 12)->nullable();
            $table->string('profile_photo')->nullable();
            $table->string('aadhaar_document')->nullable();
            $table->string('address_proof')->nullable();
            $table->string('age_proof')->nullable();
            $table->json('photos')->nullable();

            // Session tracking - remaining_sessions computed via accessor
            $table->integer('total_sessions')->default(20);
            $table->integer('completed_sessions')->default(0);

            // Enrollment
            $table->date('enrollment_date');
            $table->date('expected_completion_date')->nullable();

            // Status
            $table->enum('status', ['active', 'completed', 'dropped', 'on_hold'])->default('active');

            // Student portal access (no login)
            $table->string('access_token', 64)->unique();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
