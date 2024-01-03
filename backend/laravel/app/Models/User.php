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
        'company',
        'name',
        'email',
        'shop_mail',
        'rms_shop_mail',
        'auth_id',
        'auth_password',
        'password',
        'tel',
        'terms',
        'Authority',
        'UpdateStatus',
        'EmailAuthToken',
        'sku_project',
        'rakutenPlan',
        'trial',
        'shopName',
        'shopUrl',
        'serviceSecret',
        'licenseKey'
    ];

    public function info()
    {
        return $this->hasMany(Info::class);
    }

    public function image()
    {
        return $this->hasMany(Image::class);
    }

    public function wordConfig()
    {
        return $this->hasMany(WordConfig::class);
    }

    public function cabinet()
    {
        return $this->hasMany(Cabinet::class);
    }

    public function bigBanner()
    {
        return $this->hasMany(BigBanner::class);
    }

    public function error()
    {
        return $this->hasMany(Error::class);
    }

    public function alert()
    {
        return $this->hasMany(Alert::class);
    }

    public function setting()
    {
        return $this->hasMany(Setting::class);
    }

    public function order()
    {
        return $this->hasMany(Order::class);
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
