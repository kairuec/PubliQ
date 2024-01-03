<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ItemUrlCountRule implements Rule
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
            $item_urls = str_replace(["\r\n", "\r", "\n"], "\n", $value);
            //配列に変換
            $item_urls = explode("\n", $item_urls);
            if (count($item_urls) > 1000) {
                return 0;
            } else {
                return 1;
            }
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
        return ":指定できる商品は1000件までです。";
    }
}
