<?php

namespace App\Http\Controllers\CsvExport;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Option;
use App\Services\DBService;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;


class RakutenItemExportController extends Controller
{
    //楽天normal-item.csvフォーマット生成
    public function rakutenItemExport(Request $request)
    {
        //メモリ上限変更
        ini_set("memory_limit", "512M");
        //処理許容時間延長
        ini_set('max_execution_time', 120);

        //検索キーワード
        $keyword = $request->keyword;

        //取得件数チェック
        if (count(DBService::item_count_check($keyword)) > 5001) {
            return back()->with([
                'message' => '取得商品数が多すぎます（最大5,000商品）',
                'status' => 'alert'
            ]);
        }

        //データベースから取得
        $item_option_arrays = DBService::item_option($keyword);

        $option_column = [];
        $header_option_column = [];
        //オプション1～20を$itemに追加※初期値null
        for ($i = 1; $i <= 100; $i++) {
            $option_column  = array_merge($option_column, ["option" . $i => null]);
            $header_option_column = array_merge($header_option_column, ["商品オプション選択肢" . $i]);
        }

        $csv_datas = [];
        foreach ($item_option_arrays as $item_url => $item_option_array) {
            //商品レベルの行
            $csv_data = [
                'item_url' => $item_url,
                'option_type' => null,
                'option_name' => null,
            ];
            $csv_data = array_merge($csv_data, $option_column);
            $csv_data = array_merge($csv_data, ['option_user' => null]);
            $csv_datas[] = $csv_data;

            foreach ($item_option_array as $value) {
                //オプションレベルの行
                $csv_data = [
                    'item_url' => $item_url,
                    'option_type' => $value->option_type,
                    'option_name' => $value->option_name,
                ];
                $csv_data = array_merge($csv_data, $option_column);
                $csv_data = array_merge($csv_data, ['option_user' => $value->option_user]);

                //子オプション（選択肢）の操作
                $child_options = explode('¨', $value->child_option_name);

                //番号は選択肢が変わると1に初期化
                $no = 1;
                foreach ($child_options as $child_option) {
                    $csv_data['option' . $no] = $child_option;
                    $no += 1;
                }
                $csv_datas[] = $csv_data;
            }
        }

        //csv一行目を定義
        $header = [
            '商品管理番号（商品URL）',
            '選択肢タイプ',
            '商品オプション項目名',
        ];

        $header = array_merge($header, $header_option_column);
        $header = array_merge($header, ['商品オプション選択必須']);

        //100000件づつfputするため分割
        $array_partial = array_chunk($csv_datas, 100000); //配列分割
        // dd($array_partial);
        //csvダウンロード処理　1行目のヘッダーとcsv配列に入れる配列をuse指定
        return response()->streamDownload(function () use ($header, $array_partial) {
            $stream = fopen('php://temp', 'w');
            fputcsv($stream, $header);
            foreach ($array_partial as $csv_datas) {
                foreach ($csv_datas as $row) {
                    fputcsv($stream, $row);
                }
            }
            rewind($stream);
            //csvの文字化け防止
            echo mb_convert_encoding(stream_get_contents($stream), 'SJIS-win', 'UTF-8');
            fclose($stream);
        }, 'normal-item.csv');
    }
}
