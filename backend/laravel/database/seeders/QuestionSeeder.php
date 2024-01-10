<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('questions')->insert([
            [
                'genre' => "麺類",
                'answer' => "そば",
                'hint' => "和食",
                'failWord1' => "うどん",
                'failWord2' => "ラーメン",
                'failWord2' => "パスタ",
            ],
            [
                'genre' => "野菜",
                'answer' => "ニンジン",
                'hint' => "根菜",
                'failWord1' => "ジャガイモ",
                'failWord2' => "ゴボウ",
                'failWord2' => "タマネギ",
            ],
            [
                'genre' => "ポケモン",
                'answer' => "カイリュー",
                'hint' => "ワタルのポケモン",
                'failWord1' => "リザードン",
                'failWord2' => "ボーマンダ",
                'failWord2' => "ガブリアス",
            ],
            [
                'genre' => "アニメのキャラ",
                'answer' => "コナン",
                'hint' => "探偵",
                'failWord1' => "工藤",
                'failWord2' => "進一",
                'failWord2' => "金田一",
            ],
            [
                'genre' => "家電",
                'answer' => "冷蔵庫",
                'hint' => "キッチンにある",
                'failWord1' => "電子レンジ",
                'failWord2' => "洗濯機",
                'failWord2' => "掃除機",
            ],
        ]);
    }
}
