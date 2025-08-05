<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EmployeeMaster;
use App\Models\LoginMaster;
use Illuminate\Support\Facades\Hash;

class EmployeeMasterController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_name' => 'required|string',
            'email' => 'required|email|unique:employee_master,email',
            'contact_no' => 'required|string|max:15|unique:employee_master,contact_no',
            'address' => 'nullable|string',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:Male,Female,Other',
            'state_id' => 'required|exists:state_masters,state_id',
            'city' => 'required|string',
            'pan_card' => 'required|string|size:10|regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/|unique:employee_master,pan_card',
            'designation_id' => 'required|exists:designation_masters,id',
            'department_id' => 'required|exists:department_masters,id',
            'status' => 'required|in:Active,Inactive'
        ]);

        $employee = EmployeeMaster::create($validated);

        $username = strtolower(explode('@', $employee->email)[0]);  
        $defaultPassword = 'Emp@' . date('Y') . rand(100,999);  

         
        LoginMaster::create([
            'employee_id' => $employee->id,
            'username'    => $username,
            'password'    => Hash::make($defaultPassword),
            'status'      => 1
        ]);

        return response()->json([
             'status' => true,
        'message' => 'Employee and login created successfully',
        'login_info' => [
            'username' => $username,
            'default_password' => $defaultPassword
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
        $employee = EmployeeMaster::findOrFail($id);

        $validated = $request->validate([
            'employee_name' => 'required|string',
            'email' => 'required|email|unique:employee_master,email,' . $id,
            'contact_no' => 'required|string|max:15|unique:employee_master,contact_no,' . $id,
            'address' => 'nullable|string',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:Male,Female,Other',
            'state_id' => 'required|exists:state_masters,state_id',
            'city' => 'required|string',
            'pan_card' => 'required|string|size:10|regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/|unique:employee_master,pan_card,' . $id,
            'designation_id' => 'required|exists:designation_masters,id',
            'department_id' => 'required|exists:department_masters,id',
            'status' => 'required|in:Active,Inactive'
        ]);

        $employee->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Employee updated successfully',
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
