<?php

namespace App\Http\Controllers;
use App\Imports\InvoiceDataImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;

class InvoiceDataImportController extends Controller
{
    public function showForm()
    {
        return view('import-sales');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls'
        ]);

        Excel::import(new InvoiceDataImport, $request->file('file'));

        return redirect()->back()->with('success', 'Sales data imported successfully!');
    }
}

