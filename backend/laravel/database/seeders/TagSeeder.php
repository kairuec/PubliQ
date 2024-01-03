<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tags')->insert([
            [
                'name' => 'Excel',
                'url' => 'Excel',
                'element' => 'blog',
            ],
            [
                'name' => 'オプション',
                'url' => 'option',
                'element' => 'help',
            ],
        ]);
    }
}
