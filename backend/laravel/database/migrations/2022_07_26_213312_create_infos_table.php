<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInfosTable extends Migration
{
    /**
     * 
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('infos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->string('title');
            $table->string('url')->unique();
            $table->string('description')->nullable();
            $table->string('content', 10000)->nullable();
            $table->string('image')->nullable();
            $table->integer('sort')->nullable();
            $table->boolean('noindex')->default(false);
            $table->boolean('public')->default(false);
            $table->timestamps();
        });

        Schema::create('child_infos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('info_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->string('child_title', 100)->nullable();
            $table->string('child_content', 15000)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('child_infos');
        Schema::dropIfExists('infos');
    }
}
