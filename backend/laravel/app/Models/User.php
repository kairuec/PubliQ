<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SerializeDate;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'twitter',
        'youtube',
        'instagram',
        'password',
        'terms',
        'Authority',
    ];

    public function info()
    {
        return $this->hasMany(Info::class);
    }

    public function getRouteKeyName()
    {
        return 'shopUrl';
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'terms' => 'boolean',
        'UpdateStatus' => 'boolean',
        'sku_project' => 'boolean',
        'email_verified_at' => 'datetime',
    ];
}
