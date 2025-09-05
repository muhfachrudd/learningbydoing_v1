<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Review extends Model
{
    protected $fillable = [
        'user_id',
        'vendor_id',
        'rating',
        'review_text',
        'photo',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    /**
     * Get the user that owns the review.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the vendor that owns the review.
     */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Get the likes for the review.
     */
    public function likes(): HasMany
    {
        return $this->hasMany(ReviewLike::class);
    }

    /**
     * Get total likes count for the review.
     */
    public function getLikesCountAttribute()
    {
        return $this->likes()->where('type', 'like')->count();
    }

    /**
     * Get total dislikes count for the review.
     */
    public function getDislikesCountAttribute()
    {
        return $this->likes()->where('type', 'dislike')->count();
    }
}
