<?php

namespace App\Services;

use App\Models\Student;
use App\Models\User;

class NotificationService
{
    /**
     * Send an in-app notification to a user.
     */
    public function notifyUser(User $user, string $title, string $message, array $data = []): void
    {
        \App\Models\Notification::create([
            'notifiable_type' => User::class,
            'notifiable_id'   => $user->id,
            'type'            => 'App\\Notifications\\General',
            'title'           => $title,
            'message'         => $message,
            'data'            => $data,
            'channel'         => 'in_app',
        ]);
    }

    /**
     * Send an in-app notification to a student.
     */
    public function notifyStudent(Student $student, string $title, string $message, array $data = []): void
    {
        \App\Models\Notification::create([
            'notifiable_type' => Student::class,
            'notifiable_id'   => $student->id,
            'type'            => 'App\\Notifications\\StudentNotification',
            'title'           => $title,
            'message'         => $message,
            'data'            => $data,
            'channel'         => 'in_app',
        ]);
    }

    /**
     * Notify teacher when a student's DL becomes eligible.
     */
    public function notifyDlEligible(Student $student): void
    {
        if ($student->teacher?->user) {
            $this->notifyUser(
                $student->teacher->user,
                'DL Eligible: '.$student->name,
                "{$student->name} ({$student->student_id}) is now eligible to apply for Driving Licence.",
                ['student_id' => $student->id]
            );
        }
    }
}
