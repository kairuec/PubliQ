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
        $question = Question::findOrFail($request->id);
        $question->play += 1;
        $question->save();
        return $question;
    }

    public function random()
    {
        Log::info('fetch');
        $question = Question::where('isPublic', true)->inRandomOrder()->first();
        $question->play += 1;
        $question->save();
        return $question;
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
            EOD;
            $chat_response = chatGptService::store($prompt, "{$sentence}?");
        }

        if ($mode == 'question') {
            $prompt = <<<EOD
            「yes」か「no」で答えてください。
            答えられない場合は「unable」と答えてください。
            EOD;
            $chat_response = chatGptService::store($prompt, "「{$answer}」は{$sentence}?");
        }

        Log::info($chat_response);

        if (strstr($chat_response, 'correct') !== false) {
            $result = "正解！";
        } else if (strstr($chat_response, 'different') !== false) {
            $result = "違う！";
        } else if (strstr($chat_response, 'unable') !== false) {
            $result = "回答できません";
        } else if (strstr($chat_response, 'yes') !== false) {
            $result = "はい";
        } else {
            $result = "いいえ";
        }
        return response()->json(['result' => $result], 200);
    }

    public function createQuestion(Request $request)
    {
        // Log::info($request->values);
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
