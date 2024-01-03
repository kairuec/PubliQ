<?php

namespace App\Http\Controllers;

use Ably\AblyRest;
use App\Mail\TestMail;
use App\Models\User;
use App\Services\Api\chatGptService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;

class TestController extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function index()
    {
        // 文章
        $sentence = '水';

        // ChatGPT API処理
        $name = '料理';
        $answer = 'そば';

        $chat_response = chatGptService::store("{$name}名前当てクイズアプリ用途目的です。正解は「{$answer}」です。「はい」または「いいえ」で答えて下さい。回答で着ない場合は「回答不可」", $sentence);

        if (strstr($chat_response, 'はい') !== false) {
            $result = "はい";
        } else if (strstr($chat_response, 'いいえ') !== false) {
            $result = "いいえ";
        } else {
            $result = "回答できません";
        }
        dd($result);
    }

    //id（数値）がキャストされない連想配列の生成
    public function nocast()
    {
        $users = User::pluck('name', 'id')->mapWithKeys(function ($name, $id) {
            return [$id => $name];
        })->all();
    }

    public function ably()
    {
        // AblyのAPIキーを設定します
        $ably = new AblyRest(env('ABLY_KEY'));
        // チャンネルを取得します
        $channel = $ably->channel('example-channel');
        // メッセージを送信します
        $channel->publish('example-event', ['data' => 'Hello from Laravel']);
        return response()->json(['status' => 'success']);
    }


    public function mail()
    {
        $mail_address = ['sakurai1991@gmail.com'];
        Mail::to($mail_address)->send(new TestMail());
    }
}
