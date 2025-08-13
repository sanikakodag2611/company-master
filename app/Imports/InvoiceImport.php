<?php

namespace App\Imports;

use App\Models\Invoice;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

class InvoiceImport implements ToModel, WithHeadingRow
{
    public $skippedRows = [];
    protected $existingNos = [];

    public function __construct()
    {
        // Fetch existing invoice numbers from DB to avoid duplicates during import
        $this->existingNos = Invoice::pluck('invoice_no')->map(fn($v) => trim((string)$v))->toArray();
    }

    public function headingRow(): int
    {
        // Set the Excel heading row (adjust if your headings start on a different row)
        return 4;
    }

    public function model(array $row)
    {
        // Normalize headers for consistency
        $mapped = [];
        foreach ($row as $origKey => $value) {
            $k = $this->normalizeHeader((string)$origKey);
            $mapped[$k] = $value;
        }

        $get = fn($key) => $mapped[$key] ?? null;
        $invoiceNo = trim((string)($get('no') ?? ''));

        // Skip row if invoice number is missing
        if ($invoiceNo === '') {
            return null;
        }

        // Skip duplicates
        if (in_array($invoiceNo, $this->existingNos, true)) {
            $rowLog = $mapped;
            $rowLog['reason'] = 'Duplicate invoice_no';
            $this->skippedRows[] = $rowLog;
            return null;
        }

        // Parse numeric fields safely
        $bill_amount = (float) $get('bill_amount');
        $rate = (float) $get('rate');
        $amount = (float) $get('amount');
        $cgst_rate = (float) $get('cgst_rate');
        $sgst_rate = (float) $get('sgst_rate');
        $igst_rate = (float) $get('igst_rate');
        $freight = (float) $get('freight');
        $tax_amount = (float) $get('tax_amount');
        $qty = is_numeric($get('qty')) ? (int) $get('qty') : null;

        // Calculate tax_per as sum of CGST, SGST and IGST rates
        $tax_per = $cgst_rate + $sgst_rate + $igst_rate;

        // Add invoice_no to existing list to avoid duplicates within this import batch
        $this->existingNos[] = $invoiceNo;

        return new Invoice([
            'invoice_no' => $invoiceNo,
            'date' => $this->convertDate($get('date')),
            'customer' => $get('customer'),
            'salesman' => $get('salesman'),
            'bill_amount' => $bill_amount,
            'rate' => $rate,
            'amount' => $amount,
            'freight' => $freight,
            'tax_per' => $tax_per,
            'party_code' => $get('party_code'),
            'item' => $get('item'),
            'unit' => $get('unit'),
            'qty' => $qty,
            'hsn_code' => $get('hsn_code'),
            'destination' => $get('destination'),
            'city' => $get('city'),
            'tax_amount' => $tax_amount,
        ]);
    }

    private function normalizeHeader(string $header): string
    {
        $header = trim(mb_strtolower($header));
        $header = preg_replace('/[^a-z0-9]+/u', '_', $header);
        $header = trim($header, '_');

        // Map known variations to DB field names
        $map = [
            'bill_amountrs' => 'bill_amount',
            'gst_tds_tax_raters' => 'gst_tds_tax_rate',
            'gst_tds_tax_amountrs' => 'gst_tds_tax_amount',
            'amountrs' => 'amount',
            
            'cgst_amtrs' => 'cgst_amt',
            'sgst_amtrs' => 'sgst_amt',
            'igst_amtrs' => 'igst_amt',
            'tax_amountrs' => 'tax_amount',
            'round_offrs' => 'round_off',
        ];

        return $map[$header] ?? $header;
    }

    private function convertDate($value)
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            try {
                return ExcelDate::excelToDateTimeObject($value)->format('Y-m-d');
            } catch (\Exception $e) {
                return null;
            }
        }

        $timestamp = strtotime((string)$value);
        return $timestamp ? date('Y-m-d', $timestamp) : null;
    }

    public function getSkippedRows(): array
    {
        return $this->skippedRows;
    }
}
