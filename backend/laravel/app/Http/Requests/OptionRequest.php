<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Rules\MaxBytes;
use App\Rules\OptionSouryouRule;

class OptionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'option_name' => [
                'required',
                'string',
                new MaxBytes(255)
            ],
            'option_managiment_name' => [
                'required', 'string',
                Rule::unique('options')->where('user_id', $this->user()->id),
                new MaxBytes(255)
            ],
            'child_option' => ['array']
        ];
    }
}
