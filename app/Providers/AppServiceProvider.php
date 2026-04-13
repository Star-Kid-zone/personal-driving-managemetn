<?php

namespace App\Providers;

use App\Repositories\Interfaces\StudentRepositoryInterface;
use App\Repositories\Interfaces\TeacherRepositoryInterface;
use App\Repositories\Interfaces\TripRepositoryInterface;
use App\Repositories\Interfaces\PaymentRepositoryInterface;
use App\Repositories\Interfaces\LlrRepositoryInterface;
use App\Repositories\StudentRepository;
use App\Repositories\TeacherRepository;
use App\Repositories\TripRepository;
use App\Repositories\PaymentRepository;
use App\Repositories\LlrRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(StudentRepositoryInterface::class, StudentRepository::class);
        $this->app->bind(TeacherRepositoryInterface::class, TeacherRepository::class);
        $this->app->bind(TripRepositoryInterface::class,    TripRepository::class);
        $this->app->bind(PaymentRepositoryInterface::class, PaymentRepository::class);
        $this->app->bind(LlrRepositoryInterface::class,     LlrRepository::class);
    }

    public function boot(): void
    {
        // Force HTTPS in production only
        if ($this->app->environment('production')) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }
    }
}
