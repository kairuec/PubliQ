<?php

namespace App\Http\Controllers\CsvExport;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Option;
use Symfony\Component\HttpFoundation\StreamedResponse;


class OptionExportController extends Controller
{
    public function optionExport(Request $request)
    {
        $response = new StreamedResponse(function () use ($request) {

            // キーワードで検索
            $keyword = $request->keyword;
            $stream = fopen('php://output', 'w');

            //　文字化け回避
            stream_filter_prepend($stream, 'convert.iconv.utf-8/cp932//TRANSLIT');

            // タイトルを追加
            fputcsv($stream, [
                'オプション管理名※必須（サイト内の管理名）',
                '変更後のオプション管理名※オプション管理名を変更したい場合に使用',
                '選択肢タイプ※必須【s：セレクトボックス】【c：チェックボックス】【f：フリーテキスト】',
                '項目名※必須',
                '選択肢※フリーテキスト以外の場合必須',
                '商品オプション選択必須【必須：Y】【任意：N】',
                'オプション変更額※注文金額変更機能で利用',
                'オプションの加算金額分のポイントを付与※注文金額変更機能で使用【する：Y】【N：しない】',
                '注文金額自動変更【Y：する】【N：しない】※Nの場合はこの選択肢が含まれた注文の変更を行いません。',
            ]);

            Option::where('user_id', Auth::id())
                ->where('option_managiment_name', 'LIKE', '%' . $keyword . '%')
                ->join('child_options', 'options.id', '=', 'child_options.option_id')
                ->orderby('child_options.id', 'asc')
                ->chunk(5000, function ($results) use ($stream) {
                    foreach ($results as $result) {
                        if ($result->option_user) {
                            $option_user = 'Y';
                        } else {
                            $option_user = 'N';
                        }
                        if ($result->option_point) {
                            $option_point = 'N';
                        } else {
                            $option_point = 'Y';
                        }
                        if ($result->isAutoChange) {
                            $isAutoChange = 'Y';
                        } else {
                            $isAutoChange = 'N';
                        }
                        if ($result->option_type == 'f') {
                            $option_point = null;
                        }
                        fputcsv($stream, [
                            $result->option_managiment_name,
                            null,
                            $result->option_type,
                            $result->option_name,
                            $result->child_option_name,
                            $option_user,
                            $result->option_value,
                            $option_point,
                            $isAutoChange 
                        ]);
                    }
                });
            fclose($stream);
        });

        $response->headers->set('Content-Type', 'application/octet-stream');
        $response->headers->set('Content-Disposition', 'attachment; filename="Option.csv"');

        return $response;
    }
}
