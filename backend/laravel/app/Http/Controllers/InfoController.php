<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;
use App\Models\Info;
use App\Models\Tag;
use App\Models\ChildInfo;
use App\Models\Image;
use App\Models\WordConfig;
use App\Services\DBService;
use App\Services\Sql\SqlService;
use App\Services\WordConfigService;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class InfoController extends Controller
{
    //ブログ一覧
    public function index(Request $request)
    {
        // Log::info($request);
        //URLパラメーターにキーワード設定があった場合はそちらを優先する
        if (isset($request['paramKey'])) {
            $keyword = $request['paramKey'];
        }
        //設定がない場合
        else {
            $keyword = $request['keyword'];
        }

        $infos = Info::where('user_id', 1)
            ->Join('info_tag', function ($join) {
                $join->on('infos.id', '=', 'info_tag.info_id')
                    ->join('tags', 'info_tag.tag_id', '=', 'tags.id');
            })
            ->leftjoin('child_infos', 'infos.id', '=', 'child_infos.info_id')
            ->where('infos.public', '1')
            ->where(function ($query) use ($keyword) {
                //検索した商品URLが一致
                $query->where('infos.title', 'LIKE', '%' . $keyword . '%')
                    //または検索した商品管理名が一致
                    ->orwhere('child_infos.child_title', 'like', '%' . $keyword . '%')
                    ->orwhere('child_infos.child_content', 'like', '%' . $keyword . '%')
                    ->orwhere('infos.content', 'like', '%' . $keyword . '%')
                    ->orwhere('tags.name', 'like', '%' . $keyword . '%');
            })
            ->select('infos.url', 'infos.title', 'infos.description', 'infos.image', 'infos.updated_at', 'tags.name as tag', 'tags.element');
        //element(ブログとマニュアルどちらかが欲しい場合)
        if ($request['element'] !== null) {
            $infos = $infos->where('tags.element', $request['element']);
        }
        $infos = $infos
            ->groupBy('infos.url', 'infos.title', 'infos.description', 'infos.image', 'infos.updated_at', 'tag', 'tags.element')
            //データ取得数が多いと順番がおかしくなる不具合があるため正しい順番にソートする
            ->orderby($request['order'], $request['sort'])
            ->paginate($request['paginate']);

        //変換予定の文字と変換後の文字のリスト
        $wordConfigList = WordConfigService::list();

        //可変定型文のコンバート
        foreach ($wordConfigList as $word => $substituteWord) {
            foreach ($infos as $info) {
                $info->title = str_replace('{{' . $word . '}}', $substituteWord, $info->title);
            }
        }

        return $infos;
    }

    //ページ管理人のブログURL一覧
    public function urls(Request $request)
    {
        $infoUrls = Info::where('user_id', 1)
            ->Join('info_tag', function ($join) {
                $join->on('infos.id', '=', 'info_tag.info_id')
                    ->join('tags', 'info_tag.tag_id', '=', 'tags.id');
            })
            ->where('tags.element', $request['element'])
            ->select('infos.url')
            ->get();
        Log::info($infoUrls);

        return $infoUrls;
    }

    public function show($url)
    {
        // Log::info($url);
        // Log::info($request);

        $info = Info::where('infos.url', $url)
            //中間テーブルを結合
            ->Join('info_tag', function ($join) {
                $join->on('infos.id', '=', 'info_tag.info_id')
                    ->join('tags', 'info_tag.tag_id', '=', 'tags.id');
            })
            //データ取得数が多いと順番がおかしくなる不具合があるため正しい順番にソートする
            ->orderby('infos.updated_at', 'asc')
            ->select('infos.id', 'infos.title', 'infos.url', 'infos.content', 'infos.image', 'infos.description', 'infos.public', 'infos.noindex', 'infos.updated_at', 'tags.name as tag', 'tags.url as tagUrl', 'tags.element as tagElement')
            ->first();

        if (!empty($info)) {
            $child_infos = ChildInfo::where('info_id', $info->id)
                ->select('id', 'child_title', 'child_content')
                ->get();
            $info->child = $child_infos;
        }

        //変換予定の文字と変換後の文字のリスト
        $wordConfigList = WordConfigService::list();

        //可変定型文のコンバート
        foreach ($wordConfigList as $word => $substituteWord) {
            $info->title =  str_replace('{{' . $word . '}}', $substituteWord, $info->title);
            $info->content = str_replace('{{' . $word . '}}', $substituteWord, $info->content);
            if (!empty($info) && !empty($info->child)) {
                foreach ($info->child as $child) {
                    $child->child_title =  str_replace('{{' . $word . '}}', $substituteWord, $child->child_title);
                    $child->child_content = str_replace('{{' . $word . '}}', $substituteWord, $child->child_content);
                }
            }
        };
        $info->child = $info->child->toarray();

        return $info;
    }

    public function build(Request $request)
    {
        $element = $request['element'];

        //ブログ全情報の取得
        $sql = new SqlService();
        $infos = $sql->infoBuild($element);

        //変換予定の文字と変換後の文字のリスト
        $wordConfigList = WordConfigService::list();

        foreach ($infos as $info) {
            //可変定型文のコンバート
            foreach ($wordConfigList as $word => $substituteWord) {
                $info->title =  str_replace('{{' . $word . '}}', $substituteWord, $info->title);
                $info->content = str_replace('{{' . $word . '}}', $substituteWord, $info->content);
                $info->child = str_replace('{{' . $word . '}}', $substituteWord, $info->child);
            };
            //子はSql取得時にjson形式なのでオブジェクトに変換
            $info->child = json_decode($info->child, false);
            //子がない場合は削除
            if (reset($info->child)->child_id == null) {
                unset($info->child);
            }
        }
        return $infos;
    }
}
