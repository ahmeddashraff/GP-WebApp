<?php

namespace App\Http\Requests\User\Auth;
use Illuminate\Validation\Rules\Password;

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
            'full_name'=>['required','regex:/^(\w+\s){2}\w+$/'],
            'email'=>['required','email','unique:users'],
            'password'=>['required','confirmed','regex:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/'],
            'password_confirmation'=>['required'],
            'phone_number'=>['required','unique:users','regex:/^(010|011|012|015)\d{8}$/'],
            'national_id'=>['required','unique:users','regex:/^[0-9]{14}$/'],
            'location'=>['required'],
            'gender'=>['required', 'in:male,female'],
            'year_of_birth'=>['required'],

        ];
    }
}
