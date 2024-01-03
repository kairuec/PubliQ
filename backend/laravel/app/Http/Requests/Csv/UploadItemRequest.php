<?php

namespace App\Http\Requests\Csv;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Item;
use App\Models\Option;
use App\Services\CountService;
use App\Services\ArrayService;
use App\Services\EncodeService;
use App\Services\LimitService;

class UploadItemRequest extends FormRequest
{
    public static function value_check($file)
    {
        $row_count = 1;
        $user_id = Auth::id();
        //エラーログ
        $logs = null;
        $option_count = 0;
        $no_duplicate = true;
        $items = [];
        $create_items = [];
        $create_item_options = [];
        $update_items = [];
        $update_item_options = [];

        //商品テーブルに存在する場合とそうでない場合で配列を分けるため取得
        $item_tables = Item::where('user_id', $user_id)->select('id', 'item_url')->get()->toArray();
        $item_tables = array_column($item_tables, 'id', 'item_url');
        //中間テーブルの更新の際にoption_idを使用するため取得
        $option_tables = Option::where('user_id', $user_id)->select('id', 'option_managiment_name', 'option_point')->get()->toArray();
        //ポイント付与しないオプション数のチェックに使用
        $option_points = array_column($option_tables, 'option_point', 'option_managiment_name',);
        $no_option_points = [];
        foreach ($option_points as $key => $value) {
            if ($value > 0) {
                $no_option_points = array_merge($no_option_points, [$key => $value]);
            }
        }
        $option_tables = array_column($option_tables, 'id', 'option_managiment_name');

        //CSVを1行毎にデータ入力チェック
        foreach ($file as $row) {
            // 最終行の処理(最終行が空っぽの場合の対策
            if ($row === [null]) continue;

            //CSVフォーマットバリデーション※CSVファイルの1行目が22列無い場合はエラーに
            if ($row_count === 1) {
                for ($i = 1; $i <= 23; $i++) {
                    if (empty($row[$i])) {
                        $log = [
                            'item_url' => '',
                            'option_managiment_name' => '',
                            'error' => 'CSVが不正なフォーマットです。アップロードする際はフォーマットの列の削除等を行わないでください。<br><a href ="/csv/item_option_format.csv" class="text-blue-400 hover:underline">フォーマットはコチラ</a>'
                        ];
                        $logs[] = $log;
                    }
                }
            }

            // 2行目以降の処理
            if ($row_count > 1) {
                // CSVの文字コードがSJISなのでUTF-8に変更
                $item_url = EncodeService::csv($row, 0);
                $item_number = EncodeService::csv($row, 1);
                $item_name = EncodeService::csv($row, 2);
                $isActive = EncodeService::csv($row, 3);

                //オプション1～20列を取得
                //オプションの重複チェックも行う
                $option_duplicate_check = [];
                for ($i = 1; $i <= 20; $i++) {
                    if (isset($row[$i + 3])) {
                        ${"csv_option" . $i} = mb_convert_encoding($row[$i + 3], 'UTF-8', 'SJIS');
                    } else {
                        ${"csv_option" . $i} = null;
                    }
                    //一つの商品に重複したオプションが存在するかチェック
                    if (!isset(array_flip(array_map('strval', $option_duplicate_check))[${"csv_option" . $i}]) || ${"csv_option" . $i} === "") {
                        $option_duplicate_check[] = ${"csv_option" . $i};
                    }
                    //重複があった場合
                    else {
                        if (${"csv_option" . $i} != null) {
                            $logs[] = [
                                'item_url' => $item_url,
                                'option_managiment_name' => ${"csv_option" . $i},
                                'error' => '一つの商品に項目選択肢（オプション）が重複しています。'
                            ];
                        }
                    }
                }

                //エラーログ配列
                $log = [
                    'item_url' => $item_url,
                    'option_managiment_name' => '',
                ];

                //オプション登録数のカウント
                for ($i = 1; $i <= 20; $i++) {
                    if (!empty(${"csv_option" . $i})) {
                        $option_count = $option_count + 1;
                    }
                }

                //必須項目が空欄ならエラー
                if (empty($item_url) || empty($item_name) || empty($isActive)) {
                    $logs[] = $log + ['error' => '必須項目の商品管理番号または商品名または起動/停止が空欄です。'];
                }
                //半角英数以外の値が入力されていたらエラー
                if (preg_match('/^[!-~]+$/', $item_url) !== 1) {
                    $logs[] = $log + ['error' => '商品管理番号(商品URL)は半角英数字記号のみです。'];
                }
                if (!empty($item_number)) {
                    if (preg_match('/^[!-~ ]+$/', $item_number) !== 1) {
                        $logs[] = $log + ['error' => '商品番号は半角英数字記号スペースのみです。'];
                    }
                }

                //起動/停止がYまたはNの時の処理と、それ以外の値が入力されていたらエラーで返す
                if ($isActive === 'Y') {
                    $isActive = true;
                } elseif ($isActive === 'N') {
                    $isActive = false;
                } else {
                    $logs[] = $log + ['error' => '【起動/停止】には「Y」または「N」を入力して下さい。※Y：起動 / N：停止'];
                }

                //文字数エラー
                if (CountService::maxbyte($item_url, 32)) {
                    $logs[] = $log + ['error' => '商品管理番号(商品URL)が文字数オーバーです※最大32バイト'];
                }
                if (CountService::maxbyte($item_number, 32)) {
                    $logs[] = $log + ['error' => '商品番号が文字数オーバーです※最大32バイト'];
                }
                if (CountService::maxbyte($item_name, 255)) {
                    $logs[] = $log + ['error' => '商品名が文字数オーバーです※最大255バイト'];
                }

                //商品が重複していたらエラー
                if (!empty($item)) {
                    if (isset(array_flip($items)[$item_url])) {
                        $logs[] = $log + ['error' => '商品管理番号(商品URL)が重複しています。'];
                        $no_duplicate = false;
                    }
                }
                $item = [$item_url];
                $items = array_merge($items, $item);

                //商品テーブル更新用配列を作成
                //既に商品テーブルに存在する場合
                if (isset($item_tables[$item_url])) {
                    $update_item = [
                        'id' => $item_tables[$item_url],
                        'user_id' => auth()->user()->id,
                        'item_url' => $item_url,
                        'item_number' => $item_number,
                        'item_name' => $item_name,
                        'isActive' => $isActive
                    ];
                    $update_items[] = $update_item;
                }
                //商品テーブルに存在しない場合
                else {
                    $create_item = [
                        'user_id' => auth()->user()->id,
                        'item_url' => $item_url,
                        'item_number' => $item_number,
                        'item_name' => $item_name,
                        'isActive' => $isActive
                    ];
                    $create_items[] = $create_item;
                }

                //オプションテーブルに存在しない場合はエラーで返す
                for ($i = 1; $i <= 20; $i++) {
                    if (!isset($option_tables[${"csv_option" . $i}])) {
                        if (!empty(${"csv_option" . $i})) {
                            $logs[] = [
                                'item_url' => $item_url,
                                'option_managiment_name' => ${"csv_option" . $i},
                                'error' => '登録されていないオプション管理名です。'
                            ];
                        }
                    }
                    //オプションテーブルに存在する場合は商品オプションの中間テーブル更新用の配列に格納
                    else {
                        //重複商品がない場合に実行
                        if ($no_duplicate) {
                            //商品テーブルに存在する商品の場合
                            if (isset($item_tables[$item_url])) {
                                $update_item_option = [
                                    'item_id' => $item_tables[$item_url],
                                    'option_id' => $option_tables[${"csv_option" . $i}]
                                ];
                                $update_item_options[] = $update_item_option;
                            } else {
                                $create_item_option = [
                                    $option_tables[${"csv_option" . $i}]  => $item_url
                                ];
                                $create_item_options[] = $create_item_option;
                            }
                        }
                    }
                }
            }
            $row_count++;
        }

        // オプションが20,000件以上ならエラーにする
        if ($option_count > config('limit.import_item')) {
            $logs[] = $log + [
                'error' => '1度のCSVアップロードで商品に登録できる項目選択肢別在庫の上限を超えています。（' .
                    number_format($option_count) . '件）※最大' .
                    number_format(config('limit.import_item')) .
                    '件です。お手数ですが、CSVファイルを分割してご登録下さい。'
            ];
        }
        // dd($logs);

        //重複削除
        if (!empty($logs)) {
            $logs = ArrayService::arrays_unique($logs);
        }

        //新規オプションの登録上限に達していたらエラー
        if (!LimitService::item($user_id, count($create_items))) {
            $logs[] = $log + [
                'error' => '商品の登録上限（' . config('limit.item') . '件）に達しているため新規商品を登録できません',
            ];
        };

        //エラーがあった場合の処理
        if (!empty($logs)) {
            return [
                'error' => true,
                'logs' => $logs
            ];
        }
        //正常な場合の処理
        else {
            return [
                'update_items' => $update_items,
                'create_items' => $create_items,
                'update_item_options' => $update_item_options,
                'create_item_options' => $create_item_options,
            ];
        }
    }

    public function result()
    {
        return view('items.result');
    }
}
