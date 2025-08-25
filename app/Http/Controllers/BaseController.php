<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as Controller;

class BaseController extends Controller
{
    /**
     * Get session company_id and year_id
     * If not available, return error response.
     */
    protected function getSessionCompanyYear()
    {
        $companyId = session('company_id');
        $yearId    = session('year_id');

        if (!$companyId || !$yearId) {
            return [
                'status' => false,
                'error'  => response()->json([
                    'status'  => false,
                    'message' => 'Session expired. Please login again.'
                ], 401)
            ];
        }

        return [
            'status'     => true,
            'company_id' => $companyId,
            'year_id'    => $yearId,
        ];
    }
}
