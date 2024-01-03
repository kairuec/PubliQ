<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Services\ArrayService;
use App\Models\Error;

class ReflectionRequest extends FormRequest
{
    //skuプロジェクト導入後の更新エラーチェック
    public static function error_check($log, $user_id, $item_url)
    {
        //エラーがある場合
        if (isset($log['errors'])) {

            $error  = [
                'id' => null,
                'user_id' => $user_id,
                'element' => 'ItemUpdate',
                'object' => $item_url,
                'error' => '更新に失敗しました'
            ];

            $log = reset($log['errors']);

            //未登録エラー
            if ($log->code == 'GE0014') {
                $error['error'] = 'RMSに登録されていない商品です';
            }
            //重複エラー
            elseif ($log->code == 'IE0111') {
                $duqplicate = strstr($log->message, ':');
                $error['error'] = 'オプションが重複しています' . $duqplicate;
            }
            //そのほかのエラー内容の場合はエラー内容を直接入力
            else {
                $error['error'] = $log->message;
            }
            return $error;
        }

        //エラーがない場合
        {
            return null;
        }
    }
}
