<?php

namespace App\Services;

use App\Models\WordConfig;
use Illuminate\Support\Facades\Log;

//変換予定の文字と変換後の文字のリスト
class WordConfigService
{
    public static function list()
    {
        $wordConfigs=WordConfig::where('user_id',1)
            ->select('word','substituteWord')    
            ->get()
            ->toarray();
        return array_column($wordConfigs,'substituteWord','word');;
    }
}
