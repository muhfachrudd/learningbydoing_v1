<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vendor extends Model
{
    protected $fillable = [
        'cuisine_id',
        'name',
        'address',
        'latitude',
        'longitude',
        'opening_hours',
        'price_range',
        'contact',
        'photo',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    /**
     * Get the cuisine that owns the vendor.
     */
    public function cuisine(): BelongsTo
    {
        return $this->belongsTo(Cuisine::class);
    }

    /**
     * Get the reviews for the vendor.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get the favorites for the vendor.
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * Get average rating for the vendor.
     */
    public function getAverageRatingAttribute()
    {
        return $this->reviews()->avg('rating');
    }

    /**
     * Get total reviews count for the vendor.
     */
    public function getReviewsCountAttribute()
    {
        return $this->reviews()->count();
    }
}
