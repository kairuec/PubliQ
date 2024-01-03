<?php

namespace App\Http\Controllers\CsvUpload;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Option;
use App\Http\Requests\CsvRequest;
use App\Http\Requests\Csv\DeleteOptionRequest;
use Exception;
use SplFileObject;

class OptionDeleteController extends Controller
{
    public function optionDelete(CsvRequest $request)
    {
        Log::info($request);
        // ロケールを設定(日本語に設定)
        setlocale(LC_ALL, 'ja_JP.UTF-8');
        // アップロードしたファイルの絶対パスを取得
        $file_path = $request->file('csv_file');
        $file = new SplFileObject($file_path);
        $file->setFlags(SplFileObject::READ_CSV);
        //csvファイル内の値のバリデーション
        $csv_data = DeleteOptionRequest::value_check($file);

        //バリデーションエラーがあったらエラー画面にリダイレクト
        if (isset($csv_data['error'])) {
            $frashMessage = ['element' => 'error', 'message' => 'ファイルがアップロードに失敗しました。'];
            return ['error' => $csv_data['logs'], 'frashMessage' => $frashMessage];
        }
        //エラーがなかった場合
        else {
            $delete_option_ids = $csv_data;
        }

        //オプション削除
        Option::whereIn('id', $delete_option_ids)->delete();

        $frashMessage = ['element' => 'info', 'message' => 'オプションが削除されました。'];
        return ['error' => [], 'frashMessage' => $frashMessage];
    }
}
