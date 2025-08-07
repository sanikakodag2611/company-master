<?php

namespace App\Http\Controllers;

use App\Models\LoginMaster;
use Illuminate\Http\Request;
use App\Models\EmployeeMaster;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class LoginMasterController extends Controller
{ 
    public function login(Request $request)
{
    $request->validate([
        'username' => 'required',
        'password' => 'required',
    ]);

    $login = LoginMaster::where('username', $request->username)->first();

    if (!$login || !password_verify($request->password, $login->password)) {
        return response()->json([
            'status' => false,
            'message' => 'Invalid username or password'
        ]);
    }
 
    $employee = \App\Models\EmployeeMaster::find($login->employee_id);

    if (!$employee) {
        return response()->json([
            'status' => false,
            'message' => 'Employee not found'
        ]);
    }

    $token = $login->createToken('auth_token')->plainTextToken;

    Session::put('company_id', $employee->company_id);
    Session::put('year_id', $employee->year_id);

       return response()->json([
        'status' => true,
        'message' => 'Login successful',
        'data' => $employee,
        'token' => $token,
        'employee' => [
            'id' => $employee->id,
            'username' => $login->username,
            'company_id' => $employee->company_id,
            'year_id' => $employee->year_id,
        ],
         'session' => [
            'company_id' => Session::get('company_id'),
            'year_id' => Session::get('year_id')
        ]
    ]);
}


    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        session()->flush();

        return response()->json([
            'message' => 'Logout successful'
        ]);
    }

}



 
    
