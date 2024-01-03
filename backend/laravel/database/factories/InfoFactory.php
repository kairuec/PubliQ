<?php

namespace Database\Factories;

use App\Models\Info;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Info>
 */
class InfoFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Info::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'user_id' => 1,
            'title' => $this->faker->name,
            'url' => $this->faker->postcode,
            'public' => 1,
            'description' => $this->faker->realText(30),
            'content' => $this->faker->realText(10000),
            'image'=> 'https://s3-ap-northeast-1.amazonaws.com/netshop-support.public/images/chCyegeiXCxVxigCZ24XIxo5DtrCFe2Kn3hAC5Fu.webp'
        ];
    }
}
