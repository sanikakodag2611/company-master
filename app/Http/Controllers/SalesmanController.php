<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesmanController extends Controller
{
    public function index()
    {
        $salesmans = DB::table('invoice_records')
            ->select(
                DB::raw('MIN(id) as id'),  
                'salesman as salesman_name'
            )
            ->whereNotNull('salesman')
            ->where('salesman', '<>', '')
            ->distinct()
            ->orderBy('salesman')
            ->groupBy('salesman')
            ->get();

        return response()->json(['data' => $salesmans]);
    }
}
