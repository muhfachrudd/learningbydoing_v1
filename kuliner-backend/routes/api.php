<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CuisineController;
use App\Http\Controllers\Api\VendorController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\FavoriteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public cuisine and vendor routes
Route::get('/cuisines', [CuisineController::class, 'index']);
Route::get('/cuisines/{id}', [CuisineController::class, 'show']);
Route::get('/cuisines/{cuisineId}/vendors', [VendorController::class, 'getByCuisine']);
Route::get('/vendors', [VendorController::class, 'index']);
Route::get('/vendors/{id}', [VendorController::class, 'show']);
Route::get('/vendors/{id}/reviews', [ReviewController::class, 'getVendorReviews']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Review routes
    Route::apiResource('reviews', ReviewController::class);
    Route::post('/reviews/{id}/like', [ReviewController::class, 'toggleLike']);
    
    // Favorite routes
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/vendors/{vendorId}/favorite', [FavoriteController::class, 'toggle']);
    Route::delete('/vendors/{vendorId}/favorite', [FavoriteController::class, 'toggle']);
});
