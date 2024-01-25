<?php

namespace App\Services\Api;

use GeminiAPI\Laravel\Facades\Gemini;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;



class geminiService
{
    public static function store()
    {
        $test = Gemini::generateText('「コナン」は工藤優作？「はい」か「いいえ」か「回答できません」と答えて');
        dd($test);

        $genre = 'アニメのキャラ';
        $correctAnswer = 'コナン';
        $userAnswer = '工藤新一';

        $prompt = <<<EOD
        クイズの判定の役割をお願いします
        #お題
        {$genre}
        #正解のワード
        {$correctAnswer}
        #お願い
        回答が正解の場合は「正解」
        違う場合は「違う」と答えて
        #回答
        $userAnswer;
        EOD;

        $test = Gemini::generateText($prompt);
        dd($test);
    }
}
