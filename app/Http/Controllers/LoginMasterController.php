<?php

namespace App\Http\Controllers;

use App\Models\YearMaster;
use App\Models\LoginMaster;
use Illuminate\Http\Request;
use App\Models\CompanyMaster;
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

        if (!$login || !Hash::check($request->password, $login->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid username or password'
            ]);
        }

        $employee = EmployeeMaster::find($login->employee_id);

        if (!$employee) {
            return response()->json([
                'status' => false,
                'message' => 'Employee not found'
            ]);
        } 
        
        $token = $login->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'   => true,
            'message'  => 'Login successful',
            'token'    => $token,
            'employee' => [
                'id'         => $employee->id,
                'username'   => $login->username,
                'company_id' => $employee->company_id,
                'year_id'    => $employee->year_id,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful'
        ]);
    }
}
