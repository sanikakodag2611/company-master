<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use App\Imports\InvoiceImport;
use Maatwebsite\Excel\Facades\Excel;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::all();
        return response()->json($invoices);
    }

    public function import(Request $request)
    {
           $request->validate([
        'file' => 'required|file|mimes:xlsx,xls',
    ]);

    $import = new InvoiceImport();

    \Excel::import($import, $request->file('file'));

    $skippedRows = $import->skippedRows;

    // Extract duplicate 'no' values from skipped rows
    $duplicateNos = array_unique(array_column($skippedRows, 'no'));

    // Fetch matching existing invoices from DB
    $existingDuplicates = Invoice::whereIn('no', $duplicateNos)->get()->toArray();

    return response()->json([
        'status' => count($skippedRows) > 0 ? 'warning' : 'success',
        'message' => 'File imported with some duplicates skipped.',
        'skipped' => $skippedRows,
        'existingDuplicates' => $existingDuplicates,
    ]);
}

    
}
