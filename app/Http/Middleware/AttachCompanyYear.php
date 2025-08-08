<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AttachCompanyYear
{
    public function handle(Request $request, Closure $next)
    {
        $login = \App\Models\LoginMaster::find(optional($request->user())->id);

        if ($login) {
            $employee = \App\Models\EmployeeMaster::find($login->employee_id);

            if ($employee) {
                $request->merge([
                    'company_id' => $employee->company_id,
                    'year_id'    => $employee->year_id,
                ]);
            }
        }

        return $next($request);
    }

}
