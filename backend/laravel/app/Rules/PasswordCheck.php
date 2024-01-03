<?php

namespace App\Rules;

use App\Models\User;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class PasswordCheck implements Rule
{
    private $length;
    private $from_encoding;
    private $to_encoding;

    public function passes($attribute, $value)
    {
        $hash_Password = bcrypt($value);
        $test = User::where('password', $hash_Password)->first();
        Log::alert($test);
        $pass = Auth::user()->password;
        return (Hash::check($value, $pass));
    }

    public function message()
    {
        return 'パスワードが一致しません';
    }
}
