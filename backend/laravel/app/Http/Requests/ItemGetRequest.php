<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Rules\AlphaRule;
use App\Rules\ItemUrlRule;
use App\Rules\ItemUrlCountRule;


class ItemGetRequest extends FormRequest
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
            'isItemSelect' => ['required', 'boolean'],
            'isHiddenVariant' => ['required', 'boolean'],
            'item_urls' => [new ItemUrlRule, new ItemUrlCountRule,]
        ];
    }
}
