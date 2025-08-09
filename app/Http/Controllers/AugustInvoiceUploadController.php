<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\AugustInvoiceImport;
use Maatwebsite\Excel\Facades\Excel;

class AugustInvoiceUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new AugustInvoiceImport, $request->file('file'));

        return response()->json(['message' => 'August Invoices uploaded successfully.'], 200);
    }
}
