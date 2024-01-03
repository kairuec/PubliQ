<?php

namespace App\Http\Requests\Csv;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Option;
use App\Services\EncodeService;

class DeleteOptionRequest extends FormRequest
{
    public static function value_check($file)
    {
        $row_count = 1;
        //エラーログ
        $logs = null;

        $user_id = Auth::id();

        //オプションテーブルに存在する場合とそうでない場合で配列を分けるため取得
        $option_tables = Option::where('user_id', $user_id)->select(['id', 'option_managiment_name'])->get()->toArray();
        $option_tables = array_column($option_tables, 'id', 'option_managiment_name');
        $delete_option_ids = [];

        //取得したオブジェクトを読み込み
        foreach ($file as $row) {

            // 最終行の処理(最終行が空っぽの場合の対策
            if ($row === [null]) continue;

            // 2行目以降の処理
            if ($row_count > 1) {

                if (count($row) > 1) {

                    $log = [
                        'row' => $row_count,
                        'option_managiment_name' => '',
                        'child_option_name' => '',
                        'error' => 'CSVが不正なフォーマットです。削除する際はA列に「オプション管理名」を登録してB列以降は入力をしないでください。<br><a href ="/csv/option_delete_sample.csv" class="text-blue-400 hover:underline">フォーマットはコチラ</a>'
                    ];
                    $logs[] = $log;
                    return [
                        'error' => true,
                        'logs' => $logs
                    ];
                }

                // CSVの文字コードがSJISなのでUTF-8に変更
                $option_managiment_name = EncodeService::csv($row, 0);

                //エラーログ配列
                $log = [
                    'row' => $row_count . '行目',
                    'option_managiment_name' => $option_managiment_name,
                    'child_option_name' => '',
                ];

                //必須項目が空欄の場合にエラー
                if ($option_managiment_name === '') {
                    $logs[] = $log + ['error' => '必須項目のオプション管理名が空欄です。'];
                }

                //存在しないオプションが入力されていたら
                if (!isset($option_tables[$option_managiment_name])) {
                    $logs[] = $log + ['error' => '登録されていないオプションです。'];
                }
                //存在する場合
                else {
                    //削除するオプションIDをまとめる
                    $delete_option_ids[] = $option_tables[$option_managiment_name];
                }
            }
            $row_count++;
        }

        $delete_option_ids = array_unique($delete_option_ids);

        //1,000件以上ならエラーにする。
        if (count($delete_option_ids) - 1 > config('limit.option')) {
            $log = [
                'row' => '',
                'option_managiment_name' => '',
                'child_option_name' => '',
                'error' => '1度のCSVアップロードで削除できるオプションの上限を超えています。（' .
                    number_format($row_count - 1) .
                    '件）※最大' .
                    config('limit.option') .
                    '件です。お手数ですが、CSVファイルを分割してご登録下さい。',
            ];
            $logs[] = $log;
        }

        //エラーがあったらエラーログを
        if (isset($logs)) {
            return [
                'error' => true,
                'logs' => $logs
            ];
        }
        //正常ならcsv取得データを返す
        else {
            return $delete_option_ids;
        }
    }
}
