<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Image extends Model
{
    use HasFactory, SerializeDate;

    protected $fillable = [
        'id',
        'user_id',
        'path',
        'title',
        'element'
    ];

    protected $casts = [
        'updated_at' => 'datetime:Y/m/d',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
