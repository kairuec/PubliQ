<?php

use App\Events\TestEvent;
use App\Http\Controllers\BigBannerController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TestController;
use App\Models\Order;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\View;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::get('/file', function () {
    return view('file');
})->name('file');

Route::get('/ably', [TestController::class, 'ably']);

require __DIR__ . '/auth.php';
