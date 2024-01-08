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
        ]);
    }
}
