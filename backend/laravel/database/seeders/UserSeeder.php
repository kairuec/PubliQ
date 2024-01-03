<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'company' => '有限会社リライズ',
                'name' => 'seeder',
                'email' => 'a@a.com',
                'tel' => '',
                'password' => Hash::make('testtest'),
                'terms' => '1',
                'Authority' => 'admin',
                'trial' => 0,
                'get_limit' => config('limit.basic_get')
            ],
        ]);
    }
}
