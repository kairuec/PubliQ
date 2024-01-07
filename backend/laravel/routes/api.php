<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\InfoController;
use App\Http\Controllers\InfoEditController;
use App\Http\Controllers\QuestionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Log;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->get('/users', function () {
    return \App\Models\User::all();
});

//チャット
Route::prefix('chat')->middleware(['throttle:100,1'])->group(function () {
    Route::get('userList', [ChatController::class, 'userList']);
    Route::get('messageList', [ChatController::class, 'messageList']);
    Route::post('join', [ChatController::class, 'join']);
    Route::post('sendMessage', [ChatController::class, 'sendMessage']);
    Route::post('leave', [ChatController::class, 'leave']);
});

//クイズ
Route::prefix('question')->middleware(['throttle:100,1'])->group(function () {
    Route::get('show', [QuestionController::class, 'show']);
    Route::get('random', [QuestionController::class, 'random']);
    Route::post('store', [QuestionController::class, 'store']);
    Route::post('review', [QuestionController::class, 'review']);
    Route::post('createQuestion', [QuestionController::class, 'createQuestion']);
});

//投稿編集
Route::prefix('infoEdit')->middleware(['auth:sanctum', 'can:admin'])->group(function () {
    Route::post('index', [InfoEditController::class, 'index']);
    Route::post('store', [InfoEditController::class, 'store']);
    Route::post('delete', [InfoEditController::class, 'delete']);
    Route::post('images', [InfoEditController::class, 'images']);
    Route::post('imageDelete', [InfoEditController::class, 'imageDelete']);
    Route::post('postFiles', [InfoEditController::class, 'postFile']);
    Route::post('wordConfigIndex', [InfoEditController::class, 'wordConfigIndex']);
    Route::post('wordConfigStore', [InfoEditController::class, 'wordConfigStore']);
    Route::get('wordConfigCommon', [InfoEditController::class, 'wordConfigCommon']);
    Route::get('{id}', [InfoEditController::class, 'show']);
});

//テスト
Route::get('/test', [TestController::class, 'index']);
Route::get('/mail', [TestController::class, 'mail']);
Route::post('/postFiles', [TestController::class, 'postFile'])->name('postFile');
Route::post('/postTest', [TestController::class, 'store']);
Route::post('/imageDelete', [InfoController::class, 'imageDelete']);
