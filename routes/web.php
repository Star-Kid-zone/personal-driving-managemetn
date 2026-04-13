<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin;
use App\Http\Controllers\Teacher;
use App\Http\Controllers\Student;

// ── Public ────────────────────────────────────────
Route::get('/', fn() => redirect()->route('login'));

// ── Auth (Laravel Breeze / default) ───────────────
require __DIR__.'/auth.php';

// ── Student Portal (no login) ─────────────────────
Route::prefix('portal')->name('student.portal.')->group(function () {
    Route::get('/',        [Student\PortalController::class, 'entry'])->name('entry');
    Route::post('/access', [Student\PortalController::class, 'access'])->name('access');
    Route::get('/logout',  [Student\PortalController::class, 'logout'])->name('logout');

    Route::middleware('student.portal')->group(function () {
        Route::get('/dashboard',       [Student\PortalController::class, 'dashboard'])->name('dashboard');
        Route::get('/invoice/download',[Student\PortalController::class, 'downloadInvoice'])->name('invoice.download');
        // Alias used in JSX
        Route::get('/invoice', [Student\PortalController::class, 'downloadInvoice'])->name('invoice');
    });
});

// ── Admin Routes ──────────────────────────────────
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');

    // Students
    Route::resource('students', Admin\StudentController::class);
    Route::post('/students/{student}/invoice', [Admin\StudentController::class, 'generateInvoice'])->name('students.invoice');

    // Teachers
    Route::resource('teachers', Admin\TeacherController::class);

    // Vehicles
    Route::resource('vehicles', Admin\VehicleController::class);

    // Trips
    Route::resource('trips', Admin\TripController::class);
    Route::post('/trips/{trip}/complete', [Admin\TripController::class, 'complete'])->name('trips.complete');

    // Payments
    Route::get('/payments',  [Admin\PaymentController::class, 'index'])->name('payments.index');
    Route::post('/payments/{payment}/record', [Admin\PaymentController::class, 'record'])->name('payments.record');

    // LLR / License
    Route::get('/llr',       [Admin\LlrController::class, 'index'])->name('llr.index');
    Route::put('/llr/{student}', [Admin\LlrController::class, 'update'])->name('llr.update');

    // Analytics
    Route::get('/analytics', [Admin\AnalyticsController::class, 'index'])->name('analytics');
});

// ── Teacher Routes ────────────────────────────────
Route::middleware(['auth', 'role:teacher'])
    ->prefix('teacher')
    ->name('teacher.')
    ->group(function () {

    Route::get('/dashboard', [Teacher\DashboardController::class, 'index'])->name('dashboard');

    // Students
    Route::resource('students', Teacher\StudentController::class)->except(['destroy']);
    Route::post('/students/{student}/payment', [Teacher\StudentController::class, 'recordPayment'])->name('students.payment');
    Route::put('/students/{student}/llr',      [Teacher\StudentController::class, 'updateLlr'])->name('students.llr');
    Route::get('/students/{student}/invoice',  [Teacher\StudentController::class, 'downloadInvoice'])->name('students.invoice');
    Route::get('/llr-tracking',                [Teacher\StudentController::class, 'llrList'])->name('llr.list');

    // Trips
    Route::resource('trips', Teacher\TripController::class)->except(['destroy']);
    Route::post('/trips/{trip}/complete', [Teacher\TripController::class, 'complete'])->name('trips.complete');
});
