<?php

namespace App\Http\Controllers\CsvUpload;

use App\Http\Controllers\Controller;
use App\Http\Requests\Csv\UploadItemRequest;
use App\Http\Requests\CsvRequest;
use App\Models\Alert;
use App\Models\ChildOption;
use App\Models\Item;
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

class ItemUploadController extends Controller
{
    public function itemUpload(Request $request)
    {
        // ロケールを設定(日本語に設定)
        setlocale(LC_ALL, 'ja_JP.UTF-8');
        // アップロードしたファイルの絶対パスを取得
        $file_path = $request->file('csv_file');
        $file = new SplFileObject($file_path);
        $file->setFlags(SplFileObject::READ_CSV);
        //csvファイル内の値のバリデーション
        $csv_data = UploadItemRequest::value_check($file);
        // Log::info($csv_data);

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
        $create_item_options = [];
        try {
            DB::beginTransaction();

            //既存商品の更新があった場合に実行
            if (!empty($csv_data['update_items'])) {
                $array_partial = array_chunk($csv_data['update_items'], 5000); //配列分割
                //分割した数の分だけインサートを繰り替えす
                for ($i = 0; $i <= count($array_partial) - 1; $i++) {
                    Item::upsert($array_partial[$i], ['id']);
                }
            }

            $create_item_ids = [];
            //新規商品があった場合に実行
            if (!empty($csv_data['create_items'])) {
                //新規商品のバルクインサート
                $array_partial = array_chunk($csv_data['create_items'], 5000); //配列分割
                //分割した数の分だけインサートを繰り替えす
                for ($i = 0; $i <= count($array_partial) - 1; $i++) {
                    Item::upsert($array_partial[$i], ['id']);
                }
                //バルクインサートをした時に生成された主キーを取得してitem_idとして定義
                $lastId = DB::getPdo()->lastInsertId();
                for ($i = 0; $i < count($csv_data['create_items']); $i++) {
                    $create_item_ids[$i] = ['item_id' => $lastId +  $i];
                }
                $create_items = ArrayService::arrays_combine($csv_data['create_items'], $create_item_ids);
                //[商品URL=>生成したid]の配列
                $create_items = array_column($create_items, 'item_id', 'item_url');
                foreach ($csv_data['create_item_options'] as $array) {
                    foreach ($array as $key => $value) {
                        if (isset($create_items[$value])) {
                            $create_item_option = [
                                'item_id' => $create_items[$value],
                                'option_id' => $key
                            ];
                            //中間テーブルの更新配列に追加
                            $create_item_options[] = $create_item_option;
                        }
                    }
                }
            }

            // 更新の際に反映される商品を反映テーブルに登録
            $update_item_ids = array_column($csv_data['update_items'], 'id');
            $create_item_ids = array_column($create_item_ids, 'item_id');
            $item_ids = array_merge($create_item_ids, $update_item_ids);
            ReflectionService::option_flug($item_ids);


            //中間テーブルの更新がある場合に実行
            if (!empty($csv_data['update_item_options']) || !empty($create_item_options)) {
                //既存商品に登録されている商品とオプションの中間テーブルデータを削除
                $delete_item_option = array_column($csv_data['update_item_options'], 'item_id');
                DB::table('item_option')
                    ->whereIn('item_id', $delete_item_option)
                    ->Delete();

                //csvの商品オプション情報をバルクインサート
                $create_item_options = array_merge($csv_data['update_item_options'], $create_item_options);
                $array_partial = array_chunk($create_item_options, 5000); //配列分割
                //分割した数の分だけインサートを繰り替えす
                for ($i = 0; $i <= count($array_partial) - 1; $i++) {
                    DB::table('item_option')->upsert($array_partial[$i], ['item_id']);
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
