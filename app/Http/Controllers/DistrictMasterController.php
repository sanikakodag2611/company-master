<?php

namespace App\Http\Controllers;

use App\Models\District;
use Illuminate\Http\Request;
use App\Models\DistrictMaster;

class DistrictMasterController extends Controller
{
    
    public function index()
    {
        $districts = DistrictMaster::all();
        return response()->json([
            'status' => true,
            'data' => $districts
        ]);
    }
 
    public function store(Request $request)
    {
        $validated = $request->validate([
            'dist_name' => 'required|string|unique:district_master',
            'abbreviation' => 'required|string|max:10|unique:district_master',
            'status' => 'required|in:0,1',
        ]);

        $district = DistrictMaster::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'District created successfully',
            'data' => $district,
        ]);
    }
 
    public function show($id)
    {
        $district = DistrictMaster::findOrFail($id);
        return response()->json([
            'status' => true,
            'data' => $district
        ]);
    }
 
    public function update(Request $request, $id)
    {
        $district = DistrictMaster::findOrFail($id);

        $validated = $request->validate([
            'dist_name' => 'required|string|unique:district_master,dist_name,' . $id,
            'abbreviation' => 'required|string|max:10|unique:district_master,abbreviation,' . $id,
            'status' => 'required|in:0,1',
        ]);

        $district->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'District updated successfully',
            'data' => $district,
        ]);
    }
 
    public function destroy($id)
    {
        $district = DistrictMaster::findOrFail($id);
        $district->delete();

        return response()->json([
            'status' => true,
            'message' => 'District deleted successfully',
        ]);
    }
}
