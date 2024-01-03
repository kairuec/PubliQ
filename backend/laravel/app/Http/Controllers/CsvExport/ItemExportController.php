<?php

namespace App\Http\Controllers\CsvExport;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Option;
use App\Services\DBService;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;


class ItemExportController extends Controller
{
    //らくオプ用csv
    public function itemExport(Request $request)
    {
        //検索キーワード
        $keyword = $request->keyword;
        $item_option_table = DBService::export_item_option($keyword);
        Log::info($item_option_table);

        $csv_datas = [];
        foreach ($item_option_table as $value) {

            $item = [
                'item_url' => $value->item_url,
                'item_number' => $value->item_number,
                'item_name' => $value->item_name,
                'isActive' => 'Y',
            ];

            //ソフトデリートされていたらoff（Ｎ）
            if ($value->isActive == 0) {
                $item['isActive'] = 'N';
            }

            //オプション1～20を$itemに追加※初期値null
            for ($i = 1; $i <= 20; $i++) {
                $item = array_merge($item, ["option" . $i => null]);
            }

            $options = explode("¨", $value->option_managiment_name);

            $option_number = 1;
            foreach ($options as $option) {
                $item['option' . $option_number] = $option;
                $option_number = $option_number + 1;
            }
            $csv_datas = array_merge($csv_datas, [$value->item_url => $item]);
        }
        // dd($csv_datas);

        //csv一行目を定義
        $header = [
            '商品管理番号(商品URL)※必須',
            '商品番号',
            '商品管理名（サイト内の管理名）※必須',
            '起動（楽天反映機能・注文の金額変更機能）※必須【Y：起動】【N：停止】',
        ];
        //オプション管理名1～20まで作ってヘッダーと結合
        $header_option = [];
        for ($i = 1; $i <= 20; $i++) {
            $header_option[] = 'オプション管理名' . $i;
        }
        $header = array_merge($header, $header_option);

        //csvダウンロード処理　1行目のヘッダーとcsv配列に入れる配列をuse指定
        return response()->streamDownload(function () use ($header, $csv_datas) {
            $stream = fopen('php://temp', 'w');
            fputcsv($stream, $header);
            foreach ($csv_datas as $row) {
                fputcsv($stream, $row);
            }
            rewind($stream);
            //csvの文字化け防止
            echo mb_convert_encoding(stream_get_contents($stream), 'SJIS-win', 'UTF-8');
            fclose($stream);
        }, 'item_option.csv');
    }
}
