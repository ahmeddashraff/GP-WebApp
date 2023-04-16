<?php

namespace App\Http\Requests\Reports;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
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
            'description'=>['nullable','string','between:2,512'],
            'severity'=>['required','integer','between:1,7'],
            'status'=>['nullable','in:1,0'],
            'admin_id'=>['nullable','integer','exists:admins,id'],
            'user_id'=>['nullable','integer','exists:users,id'],
            'gov_user_id'=>['nullable','integer','exists:government_users,id'],
            'image'=>['required','mimes:png,jpg,jpeg','max:1024']
        ];
    }
}
