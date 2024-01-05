<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->string('genre')->default("");
            $table->string('answer')->default("");
            $table->string('hint')->default("")->nullable();
            $table->string('failWord1')->default("")->nullable();
            $table->string('failWord2')->default("")->nullable();
            $table->string('failWord3')->default("")->nullable();
            $table->integer('good')->default(0)->nullable();
            $table->integer('bad')->default(0)->nullable();
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
        Schema::dropIfExists('questions');
    }
};
