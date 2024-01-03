<?php

namespace App\Http\Controllers\CsvUpload;

use App\Http\Controllers\Controller;
use App\Http\Requests\Csv\DeleteItemRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Option;
use App\Http\Requests\CsvRequest;
use App\Models\Item;
use Exception;
use SplFileObject;

class ItemDeleteController extends Controller
{
    public function itemDelete(CsvRequest $request)
    {
        // ロケールを設定(日本語に設定)
        setlocale(LC_ALL, 'ja_JP.UTF-8');
        // アップロードしたファイルの絶対パスを取得
        $file_path = $request->file('csv_file');
        $file = new SplFileObject($file_path);
        $file->setFlags(SplFileObject::READ_CSV);
        //csvファイル内の値のバリデーション
        $csv_data = DeleteItemRequest::value_check($file);

        //バリデーションエラーがあったらエラー画面にリダイレクト
        if (isset($csv_data['error'])) {
            $frashMessage = ['element' => 'error', 'message' => 'ファイルがアップロードに失敗しました。'];
            return ['error' => $csv_data['logs'], 'frashMessage' => $frashMessage];
        }
        //エラーがなかった場合
        else {
            $delete_item_ids = $csv_data;
        }

        //オプション削除
        Item::whereIn('id', $delete_item_ids)->Delete();
        $frashMessage = ['element' => 'info', 'message' => '商品が削除されました。'];
        return ['error' => [], 'frashMessage' => $frashMessage];
    }
}
