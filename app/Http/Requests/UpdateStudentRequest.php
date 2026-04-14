<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'           => 'sometimes|string|max:100',
            'phone'          => 'sometimes|string|max:15',
            'alt_phone'      => 'nullable|string|max:15',
            'email'          => 'nullable|email|max:150',
            'address'        => 'sometimes|string',
            'city'           => 'nullable|string|max:100',
            'pincode'        => 'nullable|digits:6',
            'date_of_birth'  => 'sometimes|date',
            'gender'         => 'sometimes|in:male,female,other',
            'vehicle_type'   => 'sometimes|in:bike,car,both',
            'profile_photo'  => 'nullable|image|max:2048',
            'total_sessions' => 'sometimes|integer|min:1',
            'status'         => 'sometimes|in:active,completed,dropped,on_hold',
        ];
    }
}
