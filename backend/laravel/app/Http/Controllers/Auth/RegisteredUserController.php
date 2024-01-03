<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Exception;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(RegisterRequest $request)
    {
        try {
            DB::beginTransaction();

            $user = User::create([
                'company' => $request['company'],
                'name' => $request['name'],
                'email' => $request['email'],
                'tel' => $request['tel'],
                'password' => Hash::make($request['password']),
                'terms' => 1,
                'Authority' => null,
                'EmailAuthToken' => Str::random(10),
                'sku_project' => 1,
                'rakutenPlan' => $request['rakutenPlan'],
            ]);

            Setting::create([
                'user_id' => $user->id,
                'cabinetFolderCreate' => false
            ]);
            DB::commit();
        } catch (Exception $e) {
            Log::error($e);
            DB::rollback();
            return back()->withInput();
        }

        event(new Registered($user));
        Auth::login($user);

        // $user = $user->toarray();
        // Mail::send('emails.user_register', $user, function ($message) use ($request) {
        //     $message
        //         ->to($request->email)
        //         ->subject(config('original.serviceFull.name') . 'の仮登録ありがとうございます。');
        // });

    }

    public function sendEmailAuth()
    {
        $user = User::findOrFail(Auth::id());
        $user = $user->toarray();
        Mail::send('emails.user_register', $user, function ($message) use ($user) {
            $message
                ->to($user['email'])
                ->subject(config('original.serviceFullName') . 'の仮登録ありがとうございます。');
        });
        return response()->noContent();
    }

    public function EmailAuth()
    {
        //認証メールのパラメータを参照
        $EmailAuthToken = $_GET['EmailAuthToken'];
        $user = User::where('EmailAuthToken', $EmailAuthToken)->first();
        //ユーザー権限をトライアルに
        $user->Authority = 'trial';
        $user->save();

        $user = $user->toarray();
        //会員登録があったら管理者に通達メール
        Mail::send('emails.admin_register', $user, function ($message) {
            $message
                ->to('rakurakuoption@gmail.com')
                ->subject("会員登録がございました。");
        });

        //ログイン画面にリダイレクト
        $url = config('original.frontendUrl') . '/dashboard';
        return redirect()->away($url);
    }
}
