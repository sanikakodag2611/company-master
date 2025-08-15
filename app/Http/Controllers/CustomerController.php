<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
     
    public function index()
    {
        $customers = DB::table('invoice_records')
            ->select(
                DB::raw('MIN(id) as id'),  
                'customer as customer_name'
            )
            ->whereNotNull('customer')
            ->where('customer', '<>', '')
            ->distinct()
            ->orderBy('customer')
            ->groupBy('customer')
            ->get();

        return response()->json(['data' => $customers]);
    }
}

