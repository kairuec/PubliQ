<?php

namespace App\Services\Sql;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

//SQL文はここにまとめる
class SqlService
{
    //ビルド時に使用※親子ブログ情報の全取得
    public function infoBuild(string $element)
    {
        $parameter = [
            'element' => $element,
        ];

        $sql = DB::raw('
            SELECT
                infos.id AS info_id,
                infos.title,
                infos.url,
                infos.content,
                infos.image,
                infos.description,
                infos.public,
                infos.noindex,
                infos.updated_at,
                tags.name AS tag,
                tags.url AS tagUrl,
                tags.element AS tagElement,
                IFNULL(
                    CONCAT("[", GROUP_CONCAT(
                        JSON_OBJECT(
                            "child_id", child_infos.id,
                            "child_title", child_infos.child_title,
                            "child_content", child_infos.child_content
                        )
                        ORDER BY child_infos.id
                    ), "]"),
                    JSON_ARRAY()
                ) AS child
            FROM infos
            LEFT JOIN info_tag ON infos.id = info_tag.info_id
            LEFT JOIN tags ON info_tag.tag_id = tags.id
            LEFT JOIN child_infos ON infos.id = child_infos.info_id
            WHERE infos.public = 1
            AND tags.element = :element
            GROUP BY infos.id, infos.title, infos.url, infos.content, infos.image, infos.description, infos.public, infos.noindex, infos.updated_at, tags.name, tags.url, tags.element
            ORDER BY infos.updated_at ASC
        ');

        return DB::select($sql, $parameter);
    }
}
