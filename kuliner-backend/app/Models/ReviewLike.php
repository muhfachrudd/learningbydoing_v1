<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReviewLike extends Model
{
    protected $fillable = [
        'review_id',
        'user_id',
        'type',
    ];

    public $timestamps = false;

    /**
     * Get the review that owns the like.
     */
    public function review(): BelongsTo
    {
        return $this->belongsTo(Review::class);
    }

    /**
     * Get the user that owns the like.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
