<?php 
namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\LoginMaster;
use Illuminate\Support\Facades\Hash;

class LoginMasterController extends Controller
{
    public function login(LoginRequest $request)
    {
        $login = LoginMaster::where('username', $request->username)->first();

        if (!$login || !Hash::check($request->password, $login->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid username or password'
            ], 401);
        }

        $employee = $login->employee;

        if (!$employee) {
            return response()->json([
                'status' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        $company = $employee->company;
        $year = $employee->year;

        // Create token with company and year info as abilities (optional)
       $token = $login->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Login successful',
            'token' => $token,
            'company_id' => $company->id ?? null,
            'year_id' => $year->id ?? null,
            
        ]);

        // return response()->json([
        //     'status' => true,
        //     'message' => 'Login successful',
        //     'token' => $token,
        //     'employee' => [
        //         'id' => $employee->id,
        //         'username' => $login->username,
        //         'company_id' => $company->id ?? null,
        //         'year_id' => $year->id ?? null,
        //         'name' => $employee->employee_name,
        //     ],
        // ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout successful']);
    }
}
