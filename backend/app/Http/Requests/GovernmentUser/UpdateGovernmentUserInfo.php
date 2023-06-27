<?php

namespace App\Http\Requests\GovernmentUser;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGovernmentUserInfo extends FormRequest
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
        $government_user_id = $this->route('id');
        return [
            'email' => [
                'sometimes',
                'email',
                'unique:government_users,email,' . $government_user_id,
            ],
            'password' => [
                'sometimes',
                'regex:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/',
            ],
            'phone_number' => [
                'sometimes',
                'unique:government_users,phone_number,' . $government_user_id,
                'regex:/^(010|011|012|015)\d{8}$/',
            ],
        ];
    }
    }
