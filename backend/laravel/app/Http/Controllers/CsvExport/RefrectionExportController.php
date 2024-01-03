<?php

namespace App\Http\Controllers\CsvExport;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Option;
use Symfony\Component\HttpFoundation\StreamedResponse;


class RefrectionExportController extends Controller
{
    public function reflectionItemExport()
    {
        $response = new StreamedResponse(function () {
            $stream = fopen('php://output', 'w');
            //　文字化け回避
            stream_filter_prepend($stream, 'convert.iconv.utf-8/cp932//TRANSLIT');
            // タイトルを追加
            fputcsv($stream, [
                '商品管理番号(商品URL)',
                '商品管理名',
                '最終更新日',
                'エラー',
            ]);

            Item::where('items.user_id', Auth::id())
                ->join('reflections', 'items.id', '=', 'reflections.item_id')
                ->leftjoin('errors', 'items.item_url', '=', 'errors.object')
                ->select('items.item_url', 'items.item_name', 'reflections.updated_at', 'errors.error')
                ->orderby('reflections.updated_at', 'desc')
                ->orderby('items.item_url', 'asc')
                ->chunk(5000, function ($results) use ($stream) {
                    foreach ($results as $result) {
                        fputcsv($stream, [
                            $result->item_url,
                            $result->item_name,
                            $result->updated_at,
                            $result->error,
                        ]);
                    }
                });
            fclose($stream);
        });

        $response->headers->set('Content-Type', 'application/octet-stream');
        $response->headers->set('Content-Disposition', 'attachment; filename="楽天に反映する商品リスト.csv"');
        return $response;
    }
}
