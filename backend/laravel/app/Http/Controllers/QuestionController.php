<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;
use App\Models\Question;
use App\Services\Api\chatGptService;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class QuestionController extends Controller
{
    public function show(Request $request)
    {
        return  Question::findOrFail($request->id);
    }

    public function random()
    {
        return Question::inRandomOrder()->first();
    }

    //ユーザーの設定変更
    public function store(Request $request)
    {
        // Log::info($request);
        $genre =  $request->genre;
        $answer = $request->answer;
        $sentence = $request->sentence;

        if (preg_match("/正解|せいかい|答え|こたえ/", $sentence)) {
            $mode = "quiz";
        } else {
            $mode = 'question';
        }

        if ($mode == 'quiz') {
            $prompt = <<<EOD
            クイズの判定の役割をお願いします。
            #お題
            {$genre}
            #正解のワード
            {$answer}
            #お願いしたい事
            ユーザーの回答が正解の場合は「correct」とお答えください。
            違っていた場合は「different」と答えてください。
            ひらがな、カタカナ、漢字、ローマ字の表記違いは判別しないでください。
            例 正解が「トヨタ」の場合、「TOYOTA」「豊田」「とよた」は全て正解に
            EOD;
            $chat_response = chatGptService::store($prompt, "{$sentence}?");
        }

        if ($mode == 'question') {
            $prompt = <<<EOD
            {$genre}のクイズです。
            「yes」か「no」で答えてください。
            質問の意味が理解できなかったら「no」と答えてください。
            EOD;
            $chat_response = chatGptService::store($prompt, "「{$answer}」は「{$sentence}」?");
        }

        Log::info($chat_response);

        if (strstr($chat_response, 'correct') !== false) {
            $result = "正解！";
        } else if (strstr($chat_response, 'different') !== false) {
            $result = "違う！";
        } else if (strstr($chat_response, 'yes') !== false) {
            $result = "はい";
        } else {
            $result = "いいえ";
        }
        return response()->json(['result' => $result], 200);
    }

    public function createQuestion(Request $request)
    {
        Log::info($request->values);
        $question = Question::create($request->values);
        return response()->json(['id' => $question->id], 200);
    }

    public function review(Request $request)
    {
        $question = Question::findOrFail($request->id);
        if ($request->review == 'good') {
            $question->good = $question->good + 1;
        }
        if ($request->review == 'bad') {
            $question->bad = $question->bad + 1;
        }
        $question->save();
    }
}
