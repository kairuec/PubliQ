<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WordConfig extends Model
{
    use HasFactory, SerializeDate;

    protected $fillable = [
        'user_id',
        'word',
        'substituteWord',
        'configTag',
    ];
}
