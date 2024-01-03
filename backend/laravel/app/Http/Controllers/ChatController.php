<?php

namespace App\Http\Controllers;

use App\Events\PublicEvent;
use App\Events\UserLeaveEvent;
use App\Models\Alert;
use App\Models\Cabinet;
use App\Models\ChatMessage;
use App\Models\ChatUser;
use App\Models\Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\Api\ArrayToXmlService;
use App\Models\Image;
use App\Models\User;
use App\Services\Api\RmsService;
use Carbon\Carbon;
use CURLFile;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    public function sendMessage(Request $request)
    {
        Log::info('送信です。');
        // Log::info($request);
        $requests = [
            'id' => null,
            'chat_user_id' => $request->chat_user_id,
            'message' => $request->message,
        ];
        // Log::info($requests);
        $ChatMessage = ChatMessage::create($requests);
        // 現在の日時をCarbonオブジェクトとして取得
        $now = Carbon::now();
        $message = [
            'id' => $ChatMessage->id,
            'chat_user_id' => $request->chat_user_id,
            'name' => $request->name,
            'message' => $request->message,
            'updated_at' => $now->format('Y/m/d H:i')
        ];
        $event = [
            'element' => 'sendMessage',
            'object' => $message
        ];
        event(new PublicEvent($event));
        // return $event;
    }

    public function join(Request $request)
    {
        $requests = $request->all();
        $requests['isJoin'] = true;
        unset($requests['updated_at']);
        $user =  ChatUser::create($requests);

        $event = [
            'element' => 'join',
            'object' => $user
        ];
        event(new PublicEvent($event));
        return $user;
    }

    public function userList()
    {
        Log::info('取得');
        return ChatUser::where('isJoin', true)->orderby('updated_at', 'desc')->get();
    }

    public function messageList()
    {
        // Log::info('取得');
        return ChatUser::join('chat_messages', 'chat_users.id', '=', 'chat_messages.chat_user_id')->orderby('chat_messages.updated_at', 'asc')->get();
    }

    public function leave(Request $request)
    {
        $userId = $request->user_id;

        // ユーザー離脱イベントを発行
        broadcast(new UserLeaveEvent($userId))->toOthers();
        return response()->json(['message' => 'User left successfully']);
    }
}
