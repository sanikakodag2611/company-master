<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EmployeeMaster;
use App\Models\LoginMaster;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;

class EmployeeMasterController extends BaseController
{
    public function store(Request $request)
    {
        
        // $companyId = Session::get('company_id');
        // $yearId = Session::get('year_id');

        
     $company_id = session('company_id');
    $year_id = session('year_id');

    if (!$company_id || !$year_id) {
        return response()->json([
            'status' => false,
            'message' => 'Session expired or not found. Please log in again.'
        ],401);}
        $validated = $request->validate([
            'employee_name' => 'required|string',
            'email' => 'required|email|unique:employee_master,email',
            'username'=> 'required|string|unique:employee_master,username',
            'password' => 'required|min:6',
            'contact_no' => 'required|string|max:15|unique:employee_master,contact_no',
            'address' => 'nullable|string',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:Male,Female,Other',
            'state_id' => 'required|exists:state_masters,state_id',
            
            'city' => 'required|string',
            'pan_card' => 'required|string|size:10|regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/|unique:employee_master,pan_card',
            'designation_id' => 'required|exists:designation_masters,id',
            'department_id' => 'required|exists:department_masters,id',
            'status'=>'required|in:0,1',
        ]); 

       
        $validated['password'] = Hash::make($validated['password']);

        $validated['company_id'] =$company_id;
        $validated['year_id'] = $year_id;
 
        $employee = EmployeeMaster::create($validated);

        LoginMaster::create([
            'employee_id' => $employee->id,
            'username'    => $employee->username,
            'password'    => $employee->password,
            'status'      => 1,
            
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Employee and login created successfully',
            'login_info' => [
                'username' => $employee->username,
                'password' => '****** (hidden)',  
            ],
            'session' => [
              'company_id' => $company_id,
              'year_id'    => $year_id,
            ],
            'data' => $employee
        ]);
    }


    public function show($id)
    {
        $employee = EmployeeMaster::findOrFail($id);
        return response()->json([
            'status' => true,
            'data' => $employee
        ]);
    }

    public function update(Request $request, $id)
    {
        // $company_id = session('company_id');
        // $year_id = session('year_id');

        // if (!$company_id || !$year_id) {
        //     return response()->json([
        //         'status' => false,
        //         'message' => 'Session expired or not found. Please log in again.'
        //     ], 401);
        // }

        $company_id = session('company_id');
            $year_id = session('year_id');

    if (!$company_id || !$year_id) {
        return response()->json([
            'status' => false,
            'message' => 'Session expired or not found. Please log in again.'
  ],401);
}

        $employee = EmployeeMaster::findOrFail($id);

        $validated = $request->validate([
            'employee_name' => 'required|string',
            'email' => 'required|email|unique:employee_master,email,' . $id,
            'username'=> 'required|string|unique:employee_master,username,' . $id,
            'password' => 'required|min:6',
            'contact_no' => 'required|string|max:15|unique:employee_master,contact_no,' . $id,
            'address' => 'nullable|string',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:Male,Female,Other',
            'state_id' => 'required|exists:state_masters,state_id',
            'city' => 'required|string',
            'pan_card' => 'required|string|size:10|regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/|unique:employee_master,pan_card,' . $id,
            'designation_id' => 'required|exists:designation_masters,id',
            'department_id' => 'required|exists:department_masters,id',
            'status' => 'required|in:0,1',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        // $validated['company_id'] = $company_id;
        // $validated['year_id'] = $year_id;

        $employee->update($validated);

        LoginMaster::where('employee_id', $employee->id)->update([
            'username' => $employee->username,
            'password' => $employee->password,
            'status'   => 1,
            'company_id' => $company_id,
            'year_id' => $year_id,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Employee and login updated successfully',
            'login_info' => [
                'username' => $employee->username,
                'password' => '****** (hidden)',
            ],
            'data' => $employee
        ]);
    }



    public function destroy($id)
    {
        $employee = EmployeeMaster::findOrFail($id);
        $employee->delete();

        return response()->json([
            'status' => true,
            'message' => 'Employee deleted successfully'
        ]);
    }
}



 
