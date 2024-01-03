<?php

namespace App\Mail;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Exception;

//注文内容の変更を購入者に送信する際に使用
class OrderMail
{
    public function send($mail_param)
    {
        extract($mail_param);

        $mailer = Mail::mailer();
        $transport = (new \Swift_SmtpTransport('sub.fw.rakuten.ne.jp', '587'))
            ->setUsername($Username)
            ->setPassword($Password)
            ->setEncryption('tls');
        $mailer->setSwiftMailer(new \Swift_Mailer($transport));
        $mailer->alwaysFrom($from, $Mailname);

        try {
            Mail::send($blade, $mail_contents, function ($message) use ($to, $subject) {
                $message->to($to)->subject($subject);
            });
        }
        //送信失敗時
        catch (Exception $e) {
            Log::error($e);
        }
    }
}
