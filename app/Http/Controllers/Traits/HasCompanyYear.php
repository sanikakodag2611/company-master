<?php

namespace App\Http\Controllers\Traits;

use App\Models\EmployeeMaster;

trait HasCompanyYear
{
    protected function getCompanyAndYear($request)
    {
        $user = $request->user(); // Authenticated user via Sanctum

        $employee = EmployeeMaster::find($user->employee_id);

        if (!$employee) {
            abort(403, 'Invalid employee record. Please login again.');
        }

        return [
            'company_id' => $employee->company_id,
            'year_id'    => $employee->year_id,
        ];
    }
}
