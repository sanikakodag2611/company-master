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
        $this->existingNos = Invoice::pluck('no')->map(fn($v) => trim((string)$v))->toArray();
    }

    public function headingRow(): int
    {
        return 4;
    }

    public function model(array $row)
    {
        // Normalize headers
        $mapped = [];
        foreach ($row as $origKey => $value) {
            $k = $this->normalizeHeader((string)$origKey);
            $mapped[$k] = $value;
        }

        $get = fn($key) => $mapped[$key] ?? null;
        $no = trim((string)($get('no') ?? ''));

        // Skip if no invoice number
        if ($no === '') {
            return null;
        }

        // Check for duplicate invoice number
        if (in_array($no, $this->existingNos, true)) {
            $rowLog = $mapped;
            $rowLog['reason'] = 'Duplicate no';
            $this->skippedRows[] = $rowLog;
            return null;
        }

        // Amount-related fields to store as-is
        $amountFields = [
            'bill_amount',
            'gst_tds_tax_rate',
            'gst_tds_tax_amount',
            'rate',
            'amount',
            'taxable_amount',
            'cgst_rate',
            'cgst_amt',
            'sgst_rate',
            'sgst_amt',
            'igst_rate',
            'igst_amt',
            'tax_amount',
            'round_off',
            'freight',
        ];

        $rowHasIssues = false;
        $originalAmounts = [];

        foreach ($amountFields as $field) {
            $val = $get($field);
            $originalAmounts[$field] = $val;

            // Check for empty values
            if ($val === null || $val === '') {
                $rowHasIssues = true;
                $mapped['reason'] = trim(($mapped['reason'] ?? '') . "Missing value in '{$field}'; ");
            }
        }

        $this->existingNos[] = $no;

        // Log skipped rows if there are issues
        if ($rowHasIssues) {
            $log = array_merge($mapped, $originalAmounts);
            $this->skippedRows[] = $log;
            return null;
        }

        // Store exactly as they are in Excel
        return new Invoice([
            'no' => $no,
            'date' => $this->convertDate($get('date')),
            'customer' => $get('customer'),
            'salesman' => $get('salesman'),
            'bill_amount' => $originalAmounts['bill_amount'],
            'gst_tds_tax_rate' => $originalAmounts['gst_tds_tax_rate'],
            'gst_tds_tax_amount' => $originalAmounts['gst_tds_tax_amount'],
            'rate' => $originalAmounts['rate'],
            'amount' => $originalAmounts['amount'],
            'taxable_amount' => $originalAmounts['taxable_amount'],
            'cgst_rate' => $originalAmounts['cgst_rate'],
            'cgst_amt' => $originalAmounts['cgst_amt'],
            'sgst_rate' => $originalAmounts['sgst_rate'],
            'sgst_amt' => $originalAmounts['sgst_amt'],
            'igst_rate' => $originalAmounts['igst_rate'],
            'igst_amt' => $originalAmounts['igst_amt'],
            'tax_amount' => $originalAmounts['tax_amount'],
            'round_off' => $originalAmounts['round_off'],
            'freight' => $originalAmounts['freight'],
            'voucher_party_gst_no' => $get('voucher_party_gst_no'),
            'party_code' => $get('party_code'),
            'sales_gst_type' => $get('sales_gst_type'),
            'city' => $get('city'),
            'voucher_id' => $get('voucher_id'),
            'item' => $get('item'),
            'code' => $get('code'),
            'hsn_code' => $get('hsn_code'),
            'unit' => $get('unit'),
            'qty' => $get('qty'),
            'tax_code' => $get('tax_code'),
            'einvoice_no' => $get('einvoice_no'),
            'eway_bill_no' => $get('eway_bill_no'),
            'eway_bill_date' => $this->convertDate($get('eway_bill_date')),
            'destination' => $get('destination'),
        ]);
    }

    private function normalizeHeader(string $h): string
    {
        $h = trim(mb_strtolower($h));
        $h = preg_replace('/[^a-z0-9]+/u', '_', $h);
        $h = trim($h, '_');

        // Map variations to DB field names
        $map = [
            'bill_amountrs' => 'bill_amount',
            'gst_tds_tax_raters' => 'gst_tds_tax_rate',
            'gst_tds_tax_amountrs' => 'gst_tds_tax_amount',
            'amountrs' => 'amount',
            'taxable_amountrs' => 'taxable_amount',
            'cgst_amtrs' => 'cgst_amt',
            'sgst_amtrs' => 'sgst_amt',
            'igst_amtrs' => 'igst_amt',
            'tax_amountrs' => 'tax_amount',
            'round_offrs' => 'round_off'
        ];

        return $map[$h] ?? $h;
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

        $ts = strtotime((string)$value);
        return $ts ? date('Y-m-d', $ts) : null;
    }

    public function getSkippedRows(): array
    {
        return $this->skippedRows;
    }
}
