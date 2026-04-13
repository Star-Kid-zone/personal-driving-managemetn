<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Services\LlrService;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

/**
 * Daily command: Check DL eligibility for all students.
 * Tamil Nadu rule: LLR issued + 30 days = DL eligible.
 */
Artisan::command('drivemaster:check-dl-eligibility', function () {
    $service = app(LlrService::class);
    $service->runDailyEligibilityCheck();
    $this->info('DL eligibility check completed.');
})->purpose('Check and update DL eligibility for all students');

/**
 * Schedule tasks.
 */
Schedule::command('drivemaster:check-dl-eligibility')->dailyAt('06:00');
Schedule::command('queue:prune-failed')->weekly();
