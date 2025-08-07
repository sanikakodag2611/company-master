<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CompanyMaster;

class CompanyMasterController extends Controller
{
    public function index()
    { 
        return CompanyMaster::all();
    }
    public function create(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|unique:company_masters,company_name',
            'contact_person' => 'required|string',
            'country_id' => 'required|exists:country_masters,country_id',
            'state_id' => 'required|exists:state_masters,state_id',
            'city' => 'required|string',
            'company_address' => 'required|string',
            'gstin_uin' => 'required|string|size:15|unique:company_masters,gstin_uin|regex:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/',
            'pan_no' => 'required|string|size:10|unique:company_masters,pan_no|regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/',
            'contact_no' => 'required|string|unique:company_masters,contact_no|max:15',
            'email' => 'required|email|unique:company_masters,email',
            'website' => 'nullable|url',
        ]);

        $company = CompanyMaster::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Company created successfully',
            'data' => $company,
        ]);
    }
 
    public function show($id)
    {
        $company = CompanyMaster::find($id);

        if (!$company) {
            return response()->json([
                'status' => false,
                'message' => 'Company not found',
            ] );
        }

        return response()->json([
            'status' => true,
            'data' => $company,
        ]);
    }

 
    public function update(Request $request, $id)
    {
        $company = CompanyMaster::find($id);

        if (!$company) {
            return response()->json([
                'status' => false,
                'message' => 'Company not found',
            ] );
        }

        $validated = $request->validate([
            'company_name' => 'required|string|unique:company_masters,company_name,' . $id,
            'contact_person' => 'required|string',
            'country_id' => 'required|exists:country_masters,country_id',
            'state_id' => 'required|exists:state_masters,state_id',
            'city' => 'required|string',
            'company_address' => 'required|string',
            'gstin_uin' => 'required|string|size:15|unique:company_masters,gstin_uin,' . $id . '|regex:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/',
            'pan_no' => 'required|string|size:10|unique:company_masters,pan_no,' . $id . '|regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/',
            'contact_no' => 'required|string|unique:company_masters,contact_no,' . $id . '|max:15',
            'email' => 'required|email|unique:company_masters,email,' . $id,
            'website' => 'nullable|url',
        ]);

        $company->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Company updated successfully',
            'data' => $company,
        ]);
    }
 
    public function destroy($id)
    {
        $company = CompanyMaster::find($id);

        if (!$company) {
            return response()->json([
                'status' => false,
                'message' => 'Company not found',
            ] );
        }

        $company->delete();

        return response()->json([
            'status' => true,
            'message' => 'Company deleted successfully',
        ]);
    }
}
