<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ItemUrlRule implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        if (!empty($value)) {
            return !preg_match("/;|'|,/", $value);
        }
        //空ならOK
        else {
            return 1;
        }
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return ":使用できない文字【;】【,】【'】が含まれています。";
    }
}
