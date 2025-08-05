<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserMaster;

class UserMasterController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_name' => 'required|string',
            'email' => 'required|email|unique:user_masters,email',
            'contact_no' => 'required|string|max:15|unique:user_masters,contact_no',
            'address' => 'nullable|string',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:Male,Female,Other',
            'state_id' => 'required|exists:state_masters,state_id',
            'city' => 'required|string',
            'pan_card' => 'required|string|size:10|regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/|unique:user_masters,pan_card',
            'designation_id' => 'required|exists:designations,id',
            'department_id' => 'required|exists:departments,id',
            'status' => 'required|in:Active,Inactive'
        ]);

        $user = UserMaster::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'User created successfully',
            'data' => $user
        ]);
    }

    public function show($id)
    {
        $user = UserMaster::findOrFail($id);
        return response()->json([
            'status' => true,
            'data' => $user
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = UserMaster::findOrFail($id);

        $validated = $request->validate([
            'employee_name' => 'required|string',
            'email' => 'required|email|unique:user_masters,email,' . $id,
            'contact_no' => 'required|string|max:15|unique:user_masters,contact_no,' . $id,
            'address' => 'nullable|string',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:Male,Female,Other',
            'state_id' => 'required|exists:state_masters,state_id',
            'city' => 'required|string',
            'pan_card' => 'required|string|size:10|regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/|unique:user_masters,pan_card,' . $id,
            'designation_id' => 'required|exists:designations,id',
            'department_id' => 'required|exists:departments,id',
            'status' => 'required|in:Active,Inactive'
        ]);

        $user->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'User updated successfully',
            'data' => $user
        ]);
    }

    public function delete($id)
    {
        $user = UserMaster::findOrFail($id);
        $user->delete();

        return response()->json([
            'status' => true,
            'message' => 'User deleted successfully'
        ]);
    }
}
