<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Info;

class ChildInfo extends Model
{
    use HasFactory, SerializeDate;

    protected $fillable = [
        'info_id',
        'child_title',
        'child_content',
    ];

    public function info()
    {
        return $this->belongsTo(Info::class);
    }

    public function getRouteKeyName()
    {
        return 'child_url';
    }
}
