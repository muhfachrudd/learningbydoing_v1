<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cuisine;
use Illuminate\Http\Request;

class CuisineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Cuisine::with(['vendors']);
        
        // Search by name, origin_region, or category
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('origin_region', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }
        
        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }
        
        // Filter by origin_region
        if ($request->has('region')) {
            $query->where('origin_region', 'like', "%{$request->region}%");
        }
        
        $cuisines = $query->paginate($request->get('per_page', 15));
        
        return response()->json([
            'success' => true,
            'data' => $cuisines
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $cuisine = Cuisine::with(['vendors.reviews'])->find($id);
        
        if (!$cuisine) {
            return response()->json([
                'success' => false,
                'message' => 'Cuisine not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $cuisine
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
}
