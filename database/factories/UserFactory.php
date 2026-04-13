<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name'              => fake()->name(),
            'email'             => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password'          => static::$password ??= Hash::make('password'),
            'role'              => 'teacher',
            'phone'             => '9'.rand(100000000, 999999999),
            'is_active'         => true,
            'remember_token'    => Str::random(10),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn() => ['role' => 'admin']);
    }

    public function teacher(): static
    {
        return $this->state(fn() => ['role' => 'teacher']);
    }

    public function inactive(): static
    {
        return $this->state(fn() => ['is_active' => false]);
    }
}
