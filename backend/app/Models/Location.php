<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'name'
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function broadcasts(): HasMany
    {
        return $this->hasMany(Broadcast::class, 'target_location_id');
    }

    public function configurations(): HasMany
    {
        return $this->hasMany(Configuration::class);
    }
} 