<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Vendor::with(['cuisine', 'reviews']);
        
        // Search by name or address
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }
        
        // Filter by price range
        if ($request->has('price_range')) {
            $query->where('price_range', $request->price_range);
        }
        
        // Add average rating to each vendor
        $vendors = $query->get()->map(function ($vendor) {
            $vendor->rating = $vendor->reviews->avg('rating') ?? 0;
            $vendor->image_url = $vendor->photo ? asset('storage/' . $vendor->photo) : null;
            return $vendor;
        });
        
        return response()->json([
            'success' => true,
            'data' => $vendors
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $vendor = Vendor::with(['cuisine', 'reviews.user'])->find($id);
        
        if (!$vendor) {
            return response()->json([
                'success' => false,
                'message' => 'Vendor not found'
            ], 404);
        }
        
        // Add calculated fields
        $vendor->rating = $vendor->reviews->avg('rating') ?? 0;
        $vendor->image_url = $vendor->photo ? asset('storage/' . $vendor->photo) : null;
        
        return response()->json([
            'success' => true,
            'data' => $vendor
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // This will be handled by admin panel only
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 403);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // This will be handled by admin panel only
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 403);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // This will be handled by admin panel only
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 403);
    }

    /**
     * Get vendors by cuisine
     */
    public function getByCuisine($cuisineId)
    {
        $vendors = Vendor::with(['cuisine', 'reviews'])
                         ->where('cuisine_id', $cuisineId)
                         ->get()
                         ->map(function ($vendor) {
                             $vendor->rating = $vendor->reviews->avg('rating') ?? 0;
                             $vendor->image_url = $vendor->photo ? asset('storage/' . $vendor->photo) : null;
                             return $vendor;
                         });
        
        return response()->json([
            'success' => true,
            'data' => $vendors
        ]);
    }
}
