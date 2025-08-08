<?php

namespace App\Http\Controllers; 
use App\Imports\InvoiceDataImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
 
class InvoiceDataUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        try {
            Excel::import(new InvoiceDataImport, $request->file('file'));
            return response()->json(['message' => 'File imported successfully']);
        } catch (\Exception $e) {
            \Log::error('Excel import failed: ' . $e->getMessage());
            return response()->json(['message' => 'Upload failed', 'error' => $e->getMessage()], 500);
        }
    }
}
