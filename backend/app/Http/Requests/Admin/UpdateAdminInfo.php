<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdminInfo extends FormRequest
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
        $adminId = $this->route('id');
        return [
            'email' => [
                'sometimes',
                'email',
                'unique:admins,email,' . $adminId,
            ],
            'password' => [
                'sometimes',
                'regex:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/',
            ],
            'phone_number' => [
                'sometimes',
                'unique:admins,phone_number,' . $adminId,
                'regex:/^(010|011|012|015)\d{8}$/',
            ],
        ];
    }
}
