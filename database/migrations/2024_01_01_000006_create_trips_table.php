<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->string('trip_number')->unique(); // TRIP-2024-001
            $table->foreignId('teacher_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->date('trip_date');
            $table->time('start_time');
            $table->time('end_time')->nullable();
            $table->enum('vehicle_type', ['bike', 'car']);
            $table->text('route_description')->nullable();
            $table->decimal('distance_km', 8, 2)->nullable();
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled'])->default('scheduled');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('trip_students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trip_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->boolean('attended')->default(true);
            $table->integer('session_number')->nullable(); // which session this is for the student
            $table->text('performance_notes')->nullable();
            $table->enum('skill_rating', ['poor', 'average', 'good', 'excellent'])->nullable();
            $table->timestamps();

            $table->unique(['trip_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trip_students');
        Schema::dropIfExists('trips');
    }
};
