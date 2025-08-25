<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EmployeeMaster;
use App\Models\LoginMaster;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Traits\HasCompanyYear;
 
class EmployeeMasterController extends Controller
{
    use HasCompanyYear;

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_name'  => 'required|string',
            'email'          => 'required|email|unique:employee_master,email',
            'username'       => 'required|string|unique:employee_master,username',
            'password'       => 'required|min:6',
            'contact_no'     => 'required|string|max:15|unique:employee_master,contact_no',
            'address'        => 'nullable|string',
            'date_of_birth'  => 'required|date',
            'gender'         => 'required|in:Male,Female,Other',
            'state_id'       => 'required|exists:state_masters,state_id',
            'city'           => 'required|string',
            'pan_card'       => 'required|string|size:10|regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/|unique:employee_master,pan_card',
            'designation_id' => 'required|exists:designation_masters,id',
            'department_id'  => 'required|exists:department_masters,id',
            'status'         => 'required|in:0,1',
        ]);

    
        $meta = $this->getCompanyAndYear($request);

        $validated['company_id'] = $meta['company_id'];
        $validated['year_id']    = $meta['year_id'];
        $validated['password']   = Hash::make($validated['password']);

        $employee = EmployeeMaster::create($validated);

        LoginMaster::create([
            'employee_id' => $employee->id,
            'username'    => $employee->username,
            'password'    => $employee->password,
            'status'      => 1,
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Employee created successfully',
            'data'    => $employee,
        ]);
    }

    public function show($id, Request $request)
    {
        $meta = $this->getCompanyAndYear($request);

        $employee = EmployeeMaster::where('id', $id)
            ->where('company_id', $meta['company_id'])
            ->where('year_id', $meta['year_id'])
            ->firstOrFail();

        return response()->json([
            'status' => true,
            'data'   => $employee
        ]);
    }

    public function update(Request $request, $id)
    {
        $meta = $this->getCompanyAndYear($request);

        $employee = EmployeeMaster::where('id', $id)
            ->where('company_id', $meta['company_id'])
            ->where('year_id', $meta['year_id'])
            ->firstOrFail();

        $validated = $request->validate([
            'employee_name'  => 'required|string',
            'email'          => 'required|email|unique:employee_master,email,' . $id,
            'username'       => 'required|string|unique:employee_master,username,' . $id,
            'password'       => 'required|min:6',
            'contact_no'     => 'required|string|max:15|unique:employee_master,contact_no,' . $id,
            'address'        => 'nullable|string',
            'date_of_birth'  => 'required|date',
            'gender'         => 'required|in:Male,Female,Other',
            'state_id'       => 'required|exists:state_masters,state_id',
            'city'           => 'required|string',
            'pan_card'       => 'required|string|size:10|regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/|unique:employee_master,pan_card,' . $id,
            'designation_id' => 'required|exists:designation_masters,id',
            'department_id'  => 'required|exists:department_masters,id',
            'status'         => 'required|in:0,1',
        ]);

        $validated['company_id'] = $meta['company_id'];
        $validated['year_id']    = $meta['year_id'];
        $validated['password']   = Hash::make($validated['password']);

        $employee->update($validated);

        LoginMaster::where('employee_id', $employee->id)->update([
            'username'    => $employee->username,
            'password'    => $employee->password,
            'status'      => 1,
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Employee updated successfully',
            'data'    => $employee,
        ]);
    }

    public function destroy($id, Request $request)
    {
        $meta = $this->getCompanyAndYear($request);

        $employee = EmployeeMaster::where('id', $id)
            ->where('company_id', $meta['company_id'])
            ->where('year_id', $meta['year_id'])
            ->firstOrFail();

        $employee->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Employee deleted successfully',
        ]);
    }
}
