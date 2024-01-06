<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Tag;
use App\Models\ChildInfo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

class Info extends Model
{
    use HasFactory, SerializeDate;

    protected $fillable = [
        'user_id',
        'title',
        'url',
        'description',
        'content',
        'image',
        'sort',
        'noindex,',
        'public',
    ];

    protected $casts = [
        'noindex' => 'boolean',
        'public' => 'boolean',
        'updated_at' => 'datetime:Y/m/d',
    ];

    public function tags()
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }

    public function child_info()
    {
        return $this->hasMany(ChildInfo::class);
    }

    public function scopeSearchKeyword($query, $keyword)
    {
        return $query->where('infos.title', 'like', '%' . $keyword . '%')
            ->orWhere('infos.content', 'like', '%' . $keyword . '%');
    }
}
