<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'team',
        'location',
        'email',
    ];
}
