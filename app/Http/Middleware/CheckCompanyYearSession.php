<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckCompanyYearSession  // Make sure this class name exactly matches filename
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->session()->has('company_id') || !$request->session()->has('year_id')) {
            return response()->json([
                'status' => false,
                'message' => 'Session expired or missing company/year info. Please login again.'
            ], 401);
        }

        return $next($request);
    }
}
