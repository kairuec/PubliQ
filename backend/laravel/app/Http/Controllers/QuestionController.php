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
        $chat_response = chatGptService::store(
            "名前当てクイズです。ジャンルは「{$genre}」で、正解は「{$answer}」です。
            ユーザーは正解を当てるためにいろいろ質問をします。正解だった場合は「正解」と答えてください。※正解とユーザーの回答のひらがな・カタカナ・漢字の差異は判別しなくて良いです。
            ユーザーの質問が正解じゃない場合はユーザーから質問に「はい」または「いいえ」で答えて下さい。",
            "{$sentence}？"
        );
        Log::info($chat_response);

        if (strstr($chat_response, '正解') !== false) {
            $result = "正解！";
        } else if (strstr($chat_response, 'はい') !== false) {
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
