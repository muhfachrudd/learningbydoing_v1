<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cuisine extends Model
{
    protected $fillable = [
        'name',
        'description',
        'origin_region',
        'category',
        'photo',
    ];

    /**
     * Get the vendors for the cuisine.
     */
    public function vendors(): HasMany
    {
        return $this->hasMany(Vendor::class);
    }
}
