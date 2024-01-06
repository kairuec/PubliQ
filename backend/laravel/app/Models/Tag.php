<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Info;

class Tag extends Model
{
    use HasFactory, SerializeDate;

    protected $fillable = [
        'name',
        'url',
        'element'
    ];

    public function infos()
    {
        return $this->belongsToMany(Info::class)->withTimestamps();
    }

    public function getRouteKeyName()
    {
        return 'url';
    }
}
