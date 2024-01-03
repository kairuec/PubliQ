<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;
use App\Models\Info;
use App\Models\Tag;
use App\Models\ChildInfo;
use App\Console\Commands\SitemapCommand;
use App\Http\Resources\InfoEditResource;
use App\Http\Resources\InfoGetResource;
use App\Http\Resources\InfoResource;
use App\Models\Image;
use App\Models\WordConfig;
use Illuminate\Support\Str;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class InfoEditController extends Controller
{
    public function index(Request $request)
    {
        $keyword = $request['keyword'];

        $user_id = Auth::id();

        $infos = Info::where('user_id', $user_id)
            //中間テーブルを結合
            ->Join('info_tag', function ($join) {
                $join->on('infos.id', '=', 'info_tag.info_id')
                    ->join('tags', 'info_tag.tag_id', '=', 'tags.id');
            })
            ->where(function ($query) use ($keyword) {
                //検索した商品URLが一致
                $query->where('infos.title', 'LIKE', '%' . $keyword . '%')
                    //または検索した商品管理名が一致
                    ->orwhere('infos.content', 'like', '%' . $keyword . '%')
                    ->orwhere('tags.name', 'like', '%' . $keyword . '%');
            })
            //データ取得数が多いと順番がおかしくなる不具合があるため正しい順番にソートする
            ->orderby($request['order'], $request['sort'])
            ->select('infos.id', 'infos.title', 'infos.url', 'infos.public', 'infos.updated_at', 'tags.name as tag', 'tags.element')
            ->paginate($request['paginate']);

        return $infos;
    }

    public function show(int $id)
    {
        $user_id = Auth::id();

        $info = Info::where('user_id', $user_id)
            ->where('infos.id', $id)
            //中間テーブルを結合
            ->Join('info_tag', function ($join) {
                $join->on('infos.id', '=', 'info_tag.info_id')
                    ->join('tags', 'info_tag.tag_id', '=', 'tags.id');
            })
            //データ取得数が多いと順番がおかしくなる不具合があるため正しい順番にソートする
            ->orderby('infos.updated_at', 'asc')
            ->select('infos.id', 'infos.title', 'infos.url', 'infos.content', 'infos.image', 'infos.description', 'infos.public', 'infos.noindex', 'infos.updated_at', 'tags.name as tag', 'tags.url as tagUrl', 'tags.element as tagElement')
            ->first();

        //別ユーザーのIDのURLをリクエストされたら空が返ってくるため404エラーで返す
        if (empty($info)) {
            abort(404);
        }

        $child_infos = ChildInfo::where('info_id', $info->id)
            ->select('id', 'child_title', 'child_content')
            ->get()
            ->toarray();

        $info->child = $child_infos;

        return new InfoGetResource($info);
    }

    public function delete(Request $request)
    {
        Info::whereIn('id', $request)->delete();
        return response()->json(['element' => 'info', 'message' => '削除しました。'], 200);
    }

    //ファイルの中身チェック
    public function postFile(Request $request)
    {
        $user_id = Auth::id();

        try {
            DB::beginTransaction();
            if ($request->hasFile('files')) {
                $uploadedFiles = $request->file('files');

                $images = [];
                foreach ($uploadedFiles as $file) {
                    // ファイルの一時的な保存とS3へのアップロード
                    $path = $file->store('s3-bucket-name');
                    $path = Storage::disk('s3_public')->putFile('images', $file, 'public');
                    // ファイルのS3へのパブリックURLを取得

                    $images[] = [
                        "id" => null,
                        "user_id" => $user_id,
                        "path" => Storage::disk('s3_public')->url($path),
                        "title" => $file->getClientOriginalName(), // アップロードされたファイルのオリジナル名を取得するには getOriginalName() を使用します
                        "element" => "adminInfo"
                    ];
                }

                //データベースに登録
                Image::upsert($images, ['user_id']);
                DB::commit();

                return response()->json(['element' => 'info', 'message' => 'ファイルがアップロードされました。'], 200);
            } else {
                return response()->json(['element' => 'error', 'message' => '不正なデータが送信されました。'], 200);
            }
        } catch (Exception $e) {
            Log::error($e);
            DB::rollback();
            return response()->json(['element' => 'error', 'message' => '不正なデータが送信されました。'], 200);
        }
    }

    //画像一覧
    public function images(Request $request)
    {
        // Log::info($request);
        $keyword = $request['keyword'];

        $user_id = Auth::id();

        $images = Image::where('user_id', $user_id)
            ->where('element', 'adminInfo')
            ->where(function ($query) use ($keyword) {
                //検索した商品URLが一致
                $query->where('images.title', 'LIKE', '%' . $keyword . '%');
            })
            //データ取得数が多いと順番がおかしくなる不具合があるため正しい順番にソートする
            ->orderby($request['order'], $request['sort'])
            ->paginate($request['paginate']);

        return $images;
    }

    public function imageDelete(Request $request)
    {
        Image::whereIn('id', $request)->delete();
        return response()->json(['element' => 'info', 'message' => 'ファイルを削除しました。'], 200);
    }

    public function store(Request $request)
    {
        Log::info($request);

        $user_id = Auth::id();

        $url =$request['main']['url'];
        if(empty($url)){
            $url =Str::random(10);
        }

        $mainRequest =[
            'id' => $request['main']['id'],
            'user_id' =>$user_id,
            'url' =>$url,
            'title' =>$request['main']['title'],
            'description' =>$request['main']['description'],
            'content' =>$request['main']['content'],
            'image' =>$request['main']['image'],
            'noindex' =>$request['main']['noindex'],
            'public' =>$request['main']['public'],
        ];

        $childRequests = $request['childs'];

        $noEmptyChildRequests = array_filter($childRequests, function($childRequest) {
            return $childRequest['child_title'] !== '' || $childRequest['child_content'] !== '';
        });

        $tagRequest = $request['tag'];

        // Log::info($childRequests);

        try {
            DB::beginTransaction();

            //新規の場合
            if (empty($mainRequest['id'])) {
                $info = Info::create($mainRequest);
            }
            //更新の場合
            else {
                //メインの更新
                $info = Info::findOrFail($mainRequest['id']);
                $info->title = $mainRequest['title'];
                $info->content = $mainRequest['content'];
                $info->image = $mainRequest['image'];
                $info->description = $mainRequest['description'];
                $info->noindex = $mainRequest['noindex'];
                $info->public = $mainRequest['public'];
                $info->save();
                //子コンテンツは作り直すため登録中のは削除
                ChildInfo::where('info_id', $info->id)->delete();
            }

            //タグがDBに存在するかチェック
            $tag = Tag::where('name', $tagRequest['name'])->first();

            //ない場合は新規登録
            if (empty($tag)) {
                $tagRequest = array_merge($tagRequest, ['id' => null]);
                $tag = Tag::create($tagRequest);
            }
            // //記事とタグの紐づけ
            $info->tags()->sync($tag->id);
            

            if(!empty($noEmptyChildRequests)){
            //親のinfo_idを子に割り振る idは作り直すためnullに
            $childInIds = [];
            foreach ($noEmptyChildRequests as $child) {
                $childInIds[] = [...$child, 'id' => null, 'info_id' => $info->id];
            }
            //子記事の登録
            ChildInfo::upsert($childInIds, ['id']);
        }

            DB::commit();
        } catch (Exception $e) {
            Log::error($e);
            DB::rollback();
            return back()->withInput();
        }
        return response()->json(['element' => 'info', 'message' => '投稿内容を更新しました。'], 200);
    }

    public function wordConfigIndex(Request $request)
    {
        $user_id = Auth::id();
        $keyword = $request['keyword'];

        Log::alert($keyword);

        $wordConfigs = WordConfig::where('user_id', $user_id)
            ->where(function ($query) use ($keyword) {
                //検索した商品URLが一致
                $query->where('word', 'LIKE', '%' . $keyword . '%')
                    ->orwhere('substituteWord', 'like', '%' . $keyword . '%')
                    ->orwhere('configTag', 'like', '%' . $keyword . '%');
            })
            ->select('id', 'user_id', 'word', 'substituteWord', 'configTag')
            //データ取得数が多いと順番がおかしくなる不具合があるため正しい順番にソートする
            ->orderby($request['order'], $request['sort'])
            ->paginate($request['paginate']);

        return $wordConfigs;
    }

    public function wordConfigCommon(Request $request)
    {
        $user_id = 1;
        WordConfig::where('user_id', $user_id)->where('configTag', 'コンフィグ')->delete();
        $wordConfigs = [];
        foreach (config('limit') as $key => $value) {
            $wordConfig = [
                'id' => null,
                'user_id' => $user_id,
                'word' => $key,
                'substituteWord' => $value,
                'configTag' => 'コンフィグ'
            ];
            $wordConfigs[] = $wordConfig;
        }
        WordConfig::upsert($wordConfigs, 'user_id');
        return response()->json(['element' => 'info', 'message' => 'コンフィグ文を更新しました。'], 200);
    }
}
