<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;


class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url') . "/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        //ユーザー権限一覧
        //admin →管理者
        //null  →メール認証をおこなっていない
        //trial →無料トライアル期間中
        //light →ライトプラン契約者
        //basic →通常プラン契約者


        // 管理者ユーザのみ許可
        Gate::define('admin', function ($user) {
            if ($user->Authority == 'admin') {
                return true;
            } else {
                return false;
            }
        });

        Gate::define('Basic', function ($user) {
            //ライトプラン
            if ($user->Authority == 'light') {
                return false;
            }
            //メール認証が行われていない
            elseif ($user->Authority === null) {
                return false;
            }
            //その他はOK
            else {
                return true;
            }
        });
    }
}
