<?php

namespace App\Http\Requests\Csv;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Option;
use App\Services\CountService;
use App\Services\EncodeService;
use App\Services\LimitService;
use Illuminate\Support\Facades\Log;

class UploadOptionRequest extends FormRequest
{
    public static function value_check($file)
    {
        $row_count = 1;
        //エラーログ
        $logs = null;

        $user_id = Auth::id();
        $option_managiment_names = [];
        $update_option_managiment_names = [];
        $import_option_data = [];
        $import_option_datas = [];
        $update_option_datas = [];
        $create_option_datas = [];

        //オプションテーブルに存在する場合とそうでない場合で配列を分けるため取得
        $option_tables = Option::where('user_id', $user_id)->select(['id', 'option_managiment_name'])->get()->toArray();
        $option_tables = array_column($option_tables, 'id', 'option_managiment_name');

        //取得したオブジェクトを読み込み
        foreach ($file as $row) {
            // 最終行の処理(最終行が空っぽの場合の対策
            if ($row === [null]) continue;

            //CSVフォーマットバリデーション※CSVファイルの1行目が7列無い場合はエラーに
            if ($row_count === 1) {
                for ($i = 1; $i <= 8; $i++) {
                    if (empty($row[$i])) {
                        $log = [
                            'row' => $row_count,
                            'option_managiment_name' => '',
                            'child_option_name' => '',
                            'error' => 'CSVが不正なフォーマットです。アップロードする際はフォーマットの列の削除等を行わないでください。<br><a href ="/csv/option_sample.csv" class="text-blue-400 hover:underline">フォーマットはコチラ</a>'
                        ];
                        $logs[] = $log;
                        return [
                            'error' => true,
                            'logs' => $logs
                        ];
                    }
                }
            }

            // 2行目以降の処理
            if ($row_count > 1) {
                // CSVの文字コードがSJISなのでUTF-8に変更
                $option_managiment_name = EncodeService::csv($row, 0);
                $update_option_managiment_name = EncodeService::csv($row, 1);
                $option_type = strtolower(EncodeService::csv($row, 2));
                $option_name = EncodeService::csv($row, 3);
                $child_option_name = EncodeService::csv($row, 4);
                $option_user = EncodeService::csv($row, 5);
                $option_value = EncodeService::csv($row, 6);
                $option_point = EncodeService::csv($row, 7);
                $isAutoChange = EncodeService::csv($row, 8);

                //エラーログ配列
                $log = [
                    'row' => $row_count . '行目',
                    'option_managiment_name' => $option_managiment_name,
                    'child_option_name' => $child_option_name,
                ];

                //必須項目が空欄の場合にエラー
                if ($option_managiment_name === '') {
                    $logs[] = $log + ['error' => '必須項目のオプション管理名が空欄です。'];
                }
                if ($option_type === '') {
                    $logs[] = $log + ['error' => '必須項目の選択肢タイプが空欄です。'];
                }
                if ($option_type !== 'f' && $child_option_name === '') {
                    $logs[] = $log + ['error' => '選択肢タイプがs（セレクトボックス）または【c】（チェックボックス）の場合は項目選択肢を入力して下さい。'];
                }
                if ($option_name === '') {
                    $logs[] = $log + ['error' => '必須項目の項目名が空欄です。'];
                }
                if ($option_user === '') {
                    $logs[] = $log + ['error' => '必須項目の商品オプション選択必須が空欄です。'];
                }

                //文字数チェック
                if (CountService::maxbyte($option_managiment_name, 255)) {
                    $logs[] = $log + ['error' => 'オプション管理名が文字数オーバーです※最大255バイト'];
                }
                if (CountService::maxbyte($update_option_managiment_name, 255)) {
                    $logs[] = $log + ['error' => '変更後のオプション管理名が文字数オーバーです※最大255バイト'];
                }
                if (CountService::maxbyte($option_name, 255)) {
                    $logs[] = $log + ['error' => '項目名が文字数オーバーです※最大255バイト'];
                }
                if (CountService::maxbyte($child_option_name, 32)) {
                    $logs[] = $log + ['error' => '選択肢が文字数オーバーです※最大32バイト'];
                }

                //変更後のオプション管理名
                if (isset($option_tables[$update_option_managiment_name])) {
                    $logs[] = $log + ['error' => '変更後のオプション管理名は既に別のオプションで利用されています。'];
                }
                //新規作成のオプションの場合に変更後のオプションが入力されていたらエラー
                if (!isset($option_tables[$option_managiment_name]) && !empty($update_option_managiment_name)) {
                    $logs[] = $log + ['error' => '新規作成のオプションの場合は、変更後のオプション管理名は空欄にしてください。'];
                }

                //選択肢タイプ
                if (!preg_match('/^s$|^c$|^f$|^S$|^C$|^F$/', $option_type)) {
                    $logs[] = $log + ['error' => '選択肢タイプは【s】【c】【f】以外の値は入れないでください。<br><a href ="/help/option_type" class="text-blue-400 hover:underline">選択肢タイプとは</a>'];
                }
                if ($option_type === 'f' && $child_option_name !== '') {
                    $logs[] = $log + ['error' => '選択肢タイプがf（フリーテキスト）の場合は選択肢は空欄にして下さい。'];
                }

                //項目選択肢
                if (preg_match('/:/', $child_option_name)) {
                    $logs[] = $log + ['error' => '選択肢に半角コロン(:)は利用できません。'];
                }

                //オプション変更額
                if (!empty($option_value)) {
                    //数値以外の入力を除去※カンマ等の入力があったら省く例10,000
                    $option_value = preg_replace('/[^0-9.-]/', '', $option_value);
                    if (!preg_match('/-|^[0-9]+$/', $option_value)) {
                        $logs[] = $log + ['error' => 'オプション変更額を入力する場合は数値を入れてください。'];
                    }
                }
                if (empty($option_value)) {
                    $option_value = null;
                }

                //項目選択肢選択必須
                if (!empty($option_user)) {
                    if (!preg_match('/^y$|^n$|^Y$|^N$/', $option_user)) {
                        $logs[] = $log + ['error' => '【商品オプション選択必須】は【Y：必須】【N：任意】以外の値は入れないでください。'];
                    }
                    if ($option_user == 'N' || $option_user == 'n') {
                        $option_user = false;
                    }
                    //N以外なら0
                    else {
                        $option_user = true;
                    }
                }
                //オプションポイントが空欄の場合は無効に
                else {
                    $option_user = false;
                }

                //オプションポイント
                if (!empty($option_point)) {
                    if (!preg_match('/^y$|^n$|^Y$|^N$/', $option_point)) {
                        $logs[] = $log + ['error' => '【オプションの加算金額分のポイントを付与】は【Y：する】【N：しない】以外の値は入れないでください。'];
                    }
                    if ($option_point == 'N' || $option_point == 'n') {
                        $option_point = false;
                    }
                    //N以外なら0
                    else {
                        $option_point = true;
                    }
                }
                //オプションポイントが空欄の場合は無効に
                else {
                    $option_point = true;
                }

                //注文金額自動変更
                if (!empty($isAutoChange)) {
                    if (!preg_match('/^y$|^n$|^Y$|^N$/', $isAutoChange)) {
                        $logs[] = $log + ['error' => '【注文金額自動変更】は【Y：する】【N：しない】以外の値は入れないでください。'];
                    }
                    if ($isAutoChange == 'N' || $isAutoChange == 'n') {
                        $isAutoChange = false;
                    }
                    //N以外なら0
                    else {
                        $isAutoChange = true;
                    }
                }
                //オプションポイントが空欄の場合は無効に
                else {
                    $isAutoChange = true;
                }

                //オプションタイプがフリーテキストの場合
                if ($option_type == 'f') {
                    $option_point = false;
                }

                //csvの一つ上の行のオプション管理名と違う場合に実行
                if (!empty($option_managiment_names) && end($option_managiment_names) !== $option_managiment_name) {
                    //配列の値が数値型だと不具合が生じるため、文字列に変換
                    $convert_to_string_option_managiment_names = array_map('strval', $option_managiment_names);
                    //issetで検索するためキーと値を反転
                    $check_option_managiment_names = array_flip($convert_to_string_option_managiment_names);
                    if (isset($check_option_managiment_names[$option_managiment_name])) {
                        $logs[] = $log + ['error' => '別のオプションをまたいで同じオプション管理名が入力されています。'];
                    }
                    //配列の初期化
                    $import_option_datas = [];
                }
                if (!empty($update_option_managiment_names) && end($update_option_managiment_names) !== $update_option_managiment_name) {
                    //配列の値が数値型だと不具合が生じるため、文字列に変換
                    $convert_to_string_update_option_managiment_names = array_map('strval', $update_option_managiment_names);
                    //issetで検索するためキーと値を反転
                    $check_update_option_managiment_names = array_flip($convert_to_string_update_option_managiment_names);
                    if (isset($check_update_option_managiment_names[$update_option_managiment_name])) {
                        //更新後のオプション名が''の場合は無視
                        if ($update_option_managiment_name != '') {
                            $logs[] = $log + ['error' => '別のオプションをまたいで同じ変更後のオプション管理名が入力されています。'];
                        }
                    }
                }

                //変更後のオプション管理名の設定があった場合は利用
                if (!empty($update_option_managiment_name)) {
                    $convert_option_managiment_name = $update_option_managiment_name;
                }
                //ない場合はそのまま管理名
                else {
                    $convert_option_managiment_name = $option_managiment_name;
                }

                $import_option_data = [
                    'id' => null,
                    'user_id' => auth()->user()->id,
                    'option_managiment_name' => $convert_option_managiment_name,
                    'option_name' => $option_name,
                    'option_type' => $option_type,
                    'option_user' => $option_user,
                    'child_option_name' => $child_option_name,
                    'option_value' => $option_value,
                    'option_point' => $option_point,
                    'isAutoChange' => $isAutoChange,
                    'row' => $row_count . '行目',
                ];

                //オプションテーブルに存在するオプション
                if (isset($option_tables[$option_managiment_name])) {
                    $import_option_data['id'] = $option_tables[$option_managiment_name];
                    $import_option_datas[] = $import_option_data;
                    $update_option_datas = array_merge($update_option_datas, [$option_managiment_name => $import_option_datas]);
                }
                //オプションテーブルに存在しないオプション
                else {
                    $import_option_datas[] = $import_option_data;
                    $create_option_datas = array_merge($create_option_datas, [$option_managiment_name => $import_option_datas]);
                }

                //配列を作る処理
                $option_managiment_names[] = $option_managiment_name;
                $update_option_managiment_names[] = $update_option_managiment_name;
            }
            $row_count++;
        }

        // Log::info(array_flip(array_map('strval', $update_option_managiment_names)));
        // dd($create_option_datas);
        // dd($update_option_datas);

        //オプション毎のバリデーションチェック
        $option_datas = $create_option_datas + $update_option_datas;

        foreach ($option_datas as $key => $option_data) {
            $log['option_managiment_name'] = $key;

            $option_managiment_names = array_column($option_data, 'option_managiment_name');
            if (count(array_unique($option_managiment_names)) > 1) {
                $log['row'] = $option_data[0]['row'] . '以降';
                $logs[] = $log + ['error' => '一つのオプションに異なるオプション管理名が設定されています。'];
            }

            $option_names = array_column($option_data, 'option_name');
            if (count(array_unique($option_names)) > 1) {
                $log['row'] = $option_data[0]['row'] . '以降';
                $logs[] = $log + ['error' => '一つのオプションに異なる項目名が設定されています。'];
            }

            $option_types = array_column($option_data, 'option_type');
            if (count(array_unique($option_types)) > 1) {
                $log['row'] = $option_data[0]['row'] . '以降';
                $logs[] = $log + ['error' => '一つのオプションに異なる選択肢タイプが設定されています。'];
            }

            if ($option_data[0]['option_type'] == 'f') {
                if (count($option_types) > 1) {
                    $log['row'] = $option_data[0]['row'] . '以降';
                    $logs[] = $log + ['error' => '選択肢タイプが【f】の時は複数のオプションは登録できません。'];
                }
            }

            $option_users = array_column($option_data, 'option_user');
            if (count(array_unique($option_users)) > 1) {
                $log['row'] = $option_data[0]['row'] . '以降';
                $logs[] = $log + ['error' => '一つのオプションに異なる商品オプション選択必須が設定されています。'];
            }

            $option_points = array_column($option_data, 'option_point');
            if (count(array_unique($option_points)) > 1) {
                $log['row'] = $option_data[0]['row'] . '以降';
                $logs[] = $log + ['error' => '一つのオプションに異なる【オプションの加算金額分のポイントを付与】が設定されています。'];
            }

            $child_options = array_column($option_data, 'child_option_name');
            if (count($child_options) > config('limit.child_option')) {
                $log['row'] = $option_data[0]['row'] . '以降';
                $logs[] = $log + ['error' => '一つのオプションに設定できる選択肢は最大' . config('limit.child_option') . '個です。'];
            }

            $child_option_datas = [];
            foreach ($option_data as $child_option_data) {
                //オプション変更額のチェック
                if (empty($child_option_datas)) {
                    if ((int)$child_option_data['option_value'] > 0) {
                        $log['row'] = $child_option_data['row'];
                        $log['child_option_name'] = $child_option_data['child_option_name'];
                        $logs[] = $log + ['error' => '最初のオプション変更額に増額は設定できません。'];
                    }
                }
                //重複が存在しない場合
                if (!isset(array_flip(array_map('strval', $child_option_datas))[$child_option_data['child_option_name']])) {
                    //オプションタイプがフリーテキストではない場合は子オプション作成
                    if ($child_option_data['option_type'] != 'f') {
                        $child_option_datas[] = $child_option_data['child_option_name'];
                    }
                }
                //重複が存在する場合
                else {
                    $log['row'] = $child_option_data['row'];
                    $log['child_option_name'] = $child_option_data['child_option_name'];
                    $logs[] = $log + ['error' => '一つのオプションに選択肢が重複しています。'];
                }
            }
        }

        //20,000件以上ならエラーにする。
        if ($row_count - 1 > config('limit.import_option')) {
            $log = [
                'row' => '',
                'option_managiment_name' => '',
                'child_option_name' => '',
                'error' => '1度のCSVアップロードで登録できるオプションの上限を超えています。（' .
                    number_format($row_count - 1) .
                    '件）※最大' .
                    config('limit.import_option') .
                    '件です。お手数ですが、CSVファイルを分割してご登録下さい。',
            ];
            $logs[] = $log;
        }

        //新規オプションの登録上限に達していたらエラー
        if (!LimitService::option($user_id, count($create_option_datas))) {
            $log = [
                'row' => '',
                'option_managiment_name' => '',
                'child_option_name' => '',
                'error' => 'オプションの登録上限（' . config('limit.option') . '件）に達しているため新規オプションを登録できません',
            ];
            $logs[] = $log;
        };

        //エラーがあったらエラーログを
        if (isset($logs)) {
            return [
                'error' => true,
                'logs' => $logs
            ];
        }
        //正常ならcsv取得データを返す
        else {
            return [
                'update_options' => $update_option_datas,
                'create_options' => $create_option_datas,
            ];
        }
    }
}
