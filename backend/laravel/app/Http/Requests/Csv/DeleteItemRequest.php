<?php

namespace App\Http\Requests\Csv;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Item;
use App\Services\EncodeService;

class DeleteItemRequest extends FormRequest
{
    public static function value_check($file)
    {
        $row_count = 1;
        //エラーログ
        $logs = null;

        $user_id = Auth::id();

        //オプションテーブルに存在する場合とそうでない場合で配列を分けるため取得
        $item_tables = Item::where('user_id', $user_id)->select(['id', 'item_url'])->get()->toArray();
        $item_tables = array_column($item_tables, 'id', 'item_url');
        $delete_item_ids = [];

        //取得したオブジェクトを読み込み
        foreach ($file as $row) {

            // 最終行の処理(最終行が空っぽの場合の対策
            if ($row === [null]) continue;

            // 2行目以降の処理
            if ($row_count > 1) {

                if (count($row) > 1) {

                    $log = [
                        'item_url' => '',
                        'option_managiment_name' => '',
                        'error' => 'CSVが不正なフォーマットです。削除する際はA列に「商品管理番号(商品URL)」を登録してB列以降は入力をしないでください。<br><a href ="/csv/item_delete_format.csv" class="text-blue-400 hover:underline">フォーマットはコチラ</a>'
                    ];

                    $logs[] = $log;
                    return [
                        'error' => true,
                        'logs' => $logs
                    ];
                }

                // CSVの文字コードがSJISなのでUTF-8に変更
                $item_url = EncodeService::csv($row, 0);

                //エラーログ配列
                $log = [
                    'item_url' => $item_url,
                    'option_managiment_name' => '',
                ];

                //必須項目が空欄の場合にエラー
                if ($item_url === '') {
                    $logs[] = $log + ['error' => '必須項目の商品管理番号(商品URL)が空欄です。'];
                }

                //存在しないオプションが入力されていたら
                if (!isset($item_tables[$item_url])) {
                    $logs[] = $log + ['error' => '登録されていない商品です。'];
                }
                //存在する場合
                else {
                    //削除するオプションIDをまとめる
                    $delete_item_ids[] = $item_tables[$item_url];
                }
            }
            $row_count++;
        }

        $delete_item_ids = array_unique($delete_item_ids);

        //5,000件以上ならエラーにする。
        if (count($delete_item_ids) - 1 > config('limit.item')) {
            $log = [
                'item_url' => '',
                'option_managiment_name' => '',
                'error' => '1度のCSVアップロードで削除できる商品の上限を超えています。（' .
                    number_format($row_count - 1) .
                    '件）※最大' .
                    config('limit.item') .
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
            return $delete_item_ids;
        }
    }
}
