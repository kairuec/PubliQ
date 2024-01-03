<?php

namespace App\Http\Controllers\CsvUpload;

use App\Http\Controllers\Controller;
use App\Http\Requests\Csv\UploadOptionRequest;
use App\Http\Requests\CsvRequest;
use App\Models\Alert;
use App\Models\ChildOption;
use App\Models\Option;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Services\ArrayService;
use App\Services\ReflectionService;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use SplFileObject;

class OptionUploadController extends Controller
{
    public function optionUpload(Request $request)
    {
        // ロケールを設定(日本語に設定)
        setlocale(LC_ALL, 'ja_JP.UTF-8');
        // アップロードしたファイルの絶対パスを取得
        $file_path = $request->file('csv_file');
        $file = new SplFileObject($file_path);
        $file->setFlags(SplFileObject::READ_CSV);
        //csvファイル内の値のバリデーション
        $csv_data = UploadOptionRequest::value_check($file);
        //バリデーションエラーがあったらエラー画面にリダイレクト
        if (isset($csv_data['error'])) {
            $frashMessage = ['element' => 'error', 'message' => 'ファイルがアップロードに失敗しました。'];
            return ['error' => $csv_data['logs'], 'frashMessage' => $frashMessage];
        }
        // Log::info($csv_data);
        $this->update($csv_data);
        $frashMessage = ['element' => 'info', 'message' => 'ファイルがアップロードされました。'];
        return ['error' => [], 'frashMessage' => $frashMessage];
    }

    //ここからデータベースに渡す処理
    public function update($csv_data)
    {
        //オプションテーブルに既に存在するオプションの処理
        $update_option_datas = $csv_data['update_options'];
        if (!empty($update_option_datas)) {

            foreach ($update_option_datas as $key => $array) {
                foreach ($array as $value) {
                    //既に存在する子オプションの削除に使用
                    $update_option_ids[] = $value['id'];

                    //オプション更新用
                    $update_options[] = [
                        'id' => $value['id'],
                        'user_id' => $value['user_id'],
                        'option_name' => $value['option_name'],
                        'option_managiment_name' => $value['option_managiment_name'],
                        'option_user' => $value['option_user'],
                        'option_type' => $value['option_type'],
                        'option_point' => $value['option_point'],
                    ];

                    //子オプション作成用
                    $child_options[] = [
                        'id' => null,
                        'option_id' => $value['id'],
                        'child_option_name' => $value['child_option_name'],
                        'option_value' => $value['option_value'],
                        'isAutoChange' => $value[ 'isAutoChange'],
                    ];
                }
            }
            $update_options = ArrayService::arrays_unique($update_options);
            $update_option_ids = ArrayService::arrays_unique($update_option_ids);
        }
        // dd($update_options);
        // dd($update_option_datas);

        //オプションテーブルに存在しないオプション
        $create_options = null;
        $create_option_datas = $csv_data['create_options'];
        if (!empty($create_option_datas)) {
            foreach ($create_option_datas as $key => $array) {
                foreach ($array as $value) {
                    $create_options[] = [
                        'id' => null,
                        'user_id' => $value['user_id'],
                        'option_name' => $value['option_name'],
                        'option_managiment_name' => $value['option_managiment_name'],
                        'option_user' => $value['option_user'],
                        'option_type' => $value['option_type'],
                        'option_point' => $value['option_point'],
                    ];
                }
            }
            $create_options = ArrayService::arrays_unique($create_options);
        }

        try {
            DB::beginTransaction();

            //反映フラグを残す
            if (!empty($update_option_ids)) {
                ReflectionService::option_import_csv($update_option_ids);
            }

            if (!empty($update_options)) {
                //既に親に紐づく子オプションの削除
                $array_partial = array_chunk($update_option_ids, 1000); //配列分割
                for ($i = 0; $i <= count($array_partial) - 1; $i++) {
                    ChildOption::whereIn('option_id', $array_partial[$i])->delete();
                }
                //親オプションの更新
                $array_partial = array_chunk($update_options, 2000); //配列分割
                for ($i = 0; $i <= count($array_partial) - 1; $i++) {
                    Option::upsert($array_partial[$i], ['id']);
                }
            }

            if (!empty($create_options)) {
                //親オプションの新規作成
                $array_partial = array_chunk($create_options, 2000); //配列分割
                for ($i = 0; $i <= count($array_partial) - 1; $i++) {
                    Option::upsert($array_partial[$i], ['id']);
                    $lastId = DB::getPdo()->lastInsertId();
                    for ($i2 = 0; $i2 < count($array_partial[$i]); $i2++) {
                        $create_option_ids[$i2] = $lastId +  $i2;
                    }
                    $create_option_managiment_names = array_column($array_partial[$i], 'option_managiment_name');
                    $create_option_managiment_names = array_combine($create_option_managiment_names, $create_option_ids);
                }

                foreach ($create_option_datas as $key => $array) {
                    foreach ($array as $value) {
                        //子オプション作成用
                        $child_options[] = [
                            'id' => null,
                            'option_id' => $create_option_managiment_names[$key],
                            'child_option_name' => $value['child_option_name'],
                            'option_value' => $value['option_value'],
                            'isAutoChange' => $value[ 'isAutoChange'],
                        ];
                    }
                }
            }

            if (!empty($child_options)) {
                //追加した配列が2000以上なら、array_chunkで2000ずつ分割する
                $array_partial = array_chunk($child_options, 2000); //配列分割
                //分割した数の分だけインポートを繰り替えす
                for ($i = 0; $i <= count($array_partial) - 1; $i++) {
                    ChildOption::upsert($array_partial[$i], ['option_id']);
                }
            }

            DB::commit();
        } catch (Exception $e) {
            Log::error($e);
            DB::rollback();
            return back()->withInput();
        }
    }
}
