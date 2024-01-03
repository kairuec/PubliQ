<?php

return [
    /*
    |--------------------------------------------------------------------------
    |その他
    |--------------------------------------------------------------------------    |
    */
    'serviceName' => 'nscom',
    'serviceFullName' => 'ネットショップサポート.com（nscom）',
    'rakuopName' => 'らくらくオプション',
    'originalUrl' => env('APP_URL'),
    'frontendUrl' => env('FRONTEND_URL'),
    'suportEmail' => 'rakurakuoption@gmail.com',
    'helpTag' => [
        ['name' => 'オプション', 'url' => 'options'],
        ['name' => '注文管理', 'url' => 'orders'],
        ['name' => '商品編集', 'url' => 'items'],
        ['name' => 'ショップ設定', 'url' => 'shops'],
        ['name' => 'お支払い', 'url' => 'payments'],
    ],
    'blogTag' => [
        ['name' => 'お知らせ', 'url' => 'news'],
        ['name' => 'SKUプロジェクト', 'url' => 'skuProject'],
        ['name' => '楽天', 'url' => 'rakuten'],
        ['name' => 'Excel', 'url' => 'Excel'],
    ],
    'wordConfigTag' => ['名称', '料金', '数量'],
    'rakutenPlans' => [
        ['name' => 'がんばれ！プラン', 'folderCapacity' => 100, 'fileCapacity' => 500],
        ['name' => 'スタンダードプラン', 'folderCapacity' => 500, 'fileCapacity' => 2000],
        ['name' => 'メガショッププラン', 'folderCapacity' => 500, 'fileCapacity' => 2000],
    ],
];
