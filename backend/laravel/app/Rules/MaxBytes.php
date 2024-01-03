<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class MaxBytes implements Rule
{
    private $length;
    private $from_encoding;
    private $to_encoding;

    public function __construct(int $length, string $to_encoding = 'SJIS', string $from_encoding = 'UTF-8')
    {
        $this->length = $length;
        $this->to_encoding = $to_encoding;
        $this->from_encoding = $from_encoding;
    }

    public function passes($attribute, $value)
    {
        return strlen(mb_convert_encoding($value, $this->to_encoding, $this->from_encoding)) <= $this->length;
    }

    public function message()
    {
        return ":attributeが文字数オーバーです。※最大{$this->length}バイトまでです。";
    }
}
