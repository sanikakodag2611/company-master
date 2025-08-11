<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeStoreRequest;
use App\Http\Requests\EmployeeUpdateRequest;
use App\Models\EmployeeMaster;
use App\Models\LoginMaster;
use Illuminate\Support\Facades\Hash;

class EmployeeMasterController extends Controller
{
    public function store(EmployeeStoreRequest $request)
    {
        $validated = $request->validated();

        $loggedInUser = $request->user();  // may be null if no auth
        if ($loggedInUser && $loggedInUser->employee) {
            // Override company_id and year_id from logged-in user
            $validated['company_id'] = $loggedInUser->employee->company_id;
            $validated['year_id'] = $loggedInUser->employee->year_id;
        }
        // else accept company_id, year_id from request as validated

        $validated['password'] = Hash::make($validated['password']);

        $employee = EmployeeMaster::create($validated);

        LoginMaster::create([
            'employee_id' => $employee->id,
            'username' => $employee->username,
            'password' => $employee->password,
            'status' => 1,
            'company_id' => $employee->company_id,
            'year_id' => $employee->year_id,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Employee and login created successfully',
            'data' => $employee,
            'company_id' => $employee->company_id,
            'year_id' => $employee->year_id,
        ]);
    }

    public function update(EmployeeUpdateRequest $request, $id)
    {
        $employee = EmployeeMaster::findOrFail($id);

        $validated = $request->validated();

        $loggedInUser = $request->user();
        if ($loggedInUser && $loggedInUser->employee) {
            $validated['company_id'] = $loggedInUser->employee->company_id;
            $validated['year_id'] = $loggedInUser->employee->year_id;
        }
        // else accept from request input as validated

        $validated['password'] = Hash::make($validated['password']);

        $employee->update($validated);

        $employee->login()->update([
            'username' => $employee->username,
            'password' => $employee->password,
            'status' => 1,
            'company_id' => $employee->company_id,
            'year_id' => $employee->year_id,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Employee and login updated successfully',
            'data' => $employee,
        ]);
    }
}