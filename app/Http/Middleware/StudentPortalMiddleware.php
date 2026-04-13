<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StudentPortalMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!session()->has('student_portal_id')) {
            return redirect()->route('student.portal.entry')
                ->with('error', 'Please enter your Student ID to access the portal.');
        }

        return $next($request);
    }
}
