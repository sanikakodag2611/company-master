<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\InvoiceImport;
use Illuminate\Support\Facades\Log;

class InvoiceController extends Controller
{
    public function upload(Request $request)
{
    try {
        Excel::import(new InvoiceImport, $request->file('file'));
        return response()->json(['message' => 'Invoice uploaded successfully']);
    } catch (\Exception $e) {
        Log::error($e); // Log error to storage/logs/laravel.log
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
}



