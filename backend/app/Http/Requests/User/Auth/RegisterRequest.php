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
            'full_name'=>['required'],
            'email'=>['required','email','unique:users'],
            'password'=>['required',Password::defaults(),'confirmed'],
            'password_confirmation'=>['required'],
            'phone_number'=>['required','unique:users'],
            'national_id'=>['required','unique:users'],
            'location'=>['required'],
            'gender'=>['required'],
            'year_of_birth'=>['required'],

        ];
    }
}
