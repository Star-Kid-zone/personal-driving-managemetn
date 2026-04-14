<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('registration_number')->unique();
            $table->string('make');
            $table->string('model');
            $table->year('year');
            $table->enum('type', ['bike', 'car']);
            $table->string('color')->nullable();
            $table->string('fuel_type')->default('petrol');
            $table->integer('seating_capacity')->default(5);
            $table->date('insurance_expiry')->nullable();
            $table->date('pollution_expiry')->nullable();
            $table->date('fitness_expiry')->nullable();

            $table->string('vehicle_photo')->nullable();
            $table->enum('status', ['active', 'maintenance', 'inactive'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
