<?php

namespace App\Http\Requests\GovernmentUser\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'full_name'=>['required', 'regex:/^(\w+\s){2}\w+$/'],
            'email'=>['required','email','unique:government_users'],
            'password'=>['required','confirmed','regex:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/'],
            'password_confirmation'=>['required'],
            'phone_number'=>['required','unique:government_users','regex:/^(010|011|012|015)\d{8}$/'],
            'national_id'=>['required','unique:government_users','regex:/^[0-9]{14}$/'],
            'field'=>['required','in:local_municipality,civil_defense'],
            'department_loc'=>['required', 'in:cairo, alexandria, mansoura'],
        ];
    }
}
