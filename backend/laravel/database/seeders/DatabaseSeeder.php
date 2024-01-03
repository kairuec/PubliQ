<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10000)->create();
        // $this->call([
        //     // UserSeeder::class,
        //     TagSeeder::class,
        // ]);
        // $tags = Tag::all();

        // \App\Models\Info::factory(40)->create()
        //     ->each(function (\App\Models\Info $info) use ($tags) {
        //         // 中間テーブルに紐付け
        //         $info->tags()->attach(
        //             //random(n)はn個タグを付ける
        //             $tags->random(1)->pluck('id')->toArray()
        //         );
        //     });;
    }
}
