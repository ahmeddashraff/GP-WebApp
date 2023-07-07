<?php

namespace App\Http\Requests\User;

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
            'severity'=>['required','integer','in:1,2'],
            'location'=>['required','string','between:2,512'],
            'image'=>['required'],
            'type'=>['required', 'in:fire,flooding,pothole,fallen tree'],
            'longitude' => ['required', 'numeric', 'regex:/^(-?((([1-9]\d?|1[0-7]\d)(\.\d{1,6})?)|180(\.0{1,6})?))$/'],
            'latitude' => ['required', 'numeric', 'regex:/^(-?((([1-9]\d?|1[0-7]\d)(\.\d{1,6})?)|90(\.0{1,6})?))$/'],
            'confusion'=>['sometimes', 'boolean']
        ];
    }
}
