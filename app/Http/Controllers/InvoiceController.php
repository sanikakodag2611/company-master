<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use App\Imports\InvoiceImport;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
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

        Excel::import($import, $request->file('file'));

        $skippedRows = $import->skippedRows;

        // Extract duplicate 'no' values
        $duplicateNos = array_unique(array_column($skippedRows, 'no'));

        // Fetch matching existing invoices
        $existingDuplicates = Invoice::whereIn('no', $duplicateNos)->get()->toArray();

        return response()->json([
            'status' => count($skippedRows) > 0 ? 'warning' : 'success',
            'message' => count($skippedRows) > 0 
                ? 'File imported with some duplicates skipped.'
                : 'File imported successfully.',
            'skipped' => $skippedRows,
            'existingDuplicates' => $existingDuplicates,
        ]);
    }



    public function updateDuplicates(Request $request)
    {
        $rows = $request->input('rows', []);

        foreach ($rows as $row) {
            try {
                // Convert known date fields if numeric Excel serial date
                $dateFields = ['date', 'eway_bill_date', 'eway_bill_date_other_if_any'];
                foreach ($dateFields as $field) {
                    if (isset($row[$field]) && is_numeric($row[$field])) {
                        $row[$field] = $this->excelDateToDateString($row[$field]);
                    }
                }

                \App\Models\Invoice::updateOrCreate(
                    ['no' => $row['no']],
                    $row
                );
            } catch (\Exception $e) {
                \Log::error('Invoice update failed for row: ' . json_encode($row));
                \Log::error('Error: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Error updating invoice',
                    'error' => $e->getMessage(),
                ], 500);
            }
        }

        return response()->json(['message' => 'Duplicates updated successfully']);
    }

    private function excelDateToDateString($excelDate)
    {
        $unixTimestamp = ($excelDate - 25569) * 86400;
        return gmdate("Y-m-d", $unixTimestamp);
    }

}
