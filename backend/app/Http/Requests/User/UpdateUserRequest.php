<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
        $userId = $this->user('sanctum')->id;
        return [
            'email' => [
                'sometimes',
                'email',
                'unique:users,email,' . $userId,
            ],
            'password' => [
                'sometimes',
                'regex:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/',
            ],
            'phone_number' => [
                'sometimes',
                'unique:users,phone_number,' . $userId,
                'regex:/^(010|011|012|015)\d{8}$/',
            ],
        ];
    }
}
