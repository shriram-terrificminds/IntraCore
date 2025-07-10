<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComplaintImage extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'complaint_id',
        'image_url',
        'image_type'
    ];

    protected $dates = [
        'uploaded_at'
    ];

    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class);
    }
} 