<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EnrollStudentRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'            => 'required|string|max:100',
            'phone'           => 'required|string|max:15',
            'alt_phone'       => 'nullable|string|max:15',
            'email'           => 'nullable|email|max:150',
            'address'         => 'required|string',
            'city'            => 'nullable|string|max:100',
            'pincode'         => 'nullable|digits:6',
            'date_of_birth'   => 'required|date|before:-16 years',
            'gender'          => 'required|in:male,female,other',
            'vehicle_type'    => 'required|in:bike,car,both',
            'aadhaar_number'  => 'nullable|digits:12',
            'profile_photo'   => 'nullable|image|max:2048',
            'aadhaar_document'=> 'nullable|file|max:5120',
            'address_proof'   => 'nullable|file|max:5120',
            'age_proof'       => 'nullable|file|max:5120',
            'total_sessions'  => 'required|integer|min:5|max:100',
            'enrollment_date' => 'nullable|date',
            // Payment
            'total_fee'       => 'required|numeric|min:0',
            'amount_paid'     => 'nullable|numeric|min:0',
            'payment_type'    => 'required|in:full,half,partial',
            'payment_mode'    => 'required|in:cash,upi,card,bank_transfer,cheque',
        ];
    }

    public function messages(): array
    {
        return [
            'date_of_birth.before' => 'Student must be at least 16 years old.',
            'aadhaar_number.digits' => 'Aadhaar number must be exactly 12 digits.',
        ];
    }
}
