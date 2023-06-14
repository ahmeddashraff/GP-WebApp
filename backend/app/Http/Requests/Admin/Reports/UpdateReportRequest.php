<?php

namespace App\Http\Requests\Admin\Reports;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReportRequest extends FormRequest
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
            'status'=>['nullable','in:1,0'],
            'admin_id'=>['nullable','integer','exists:admins,id'],
            'user_id'=>['nullable','integer','exists:users,id'],
            'gov_user_id'=>['nullable','integer','exists:government_users,id']        ];
    }
}
