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
        // Load all existing 'no' values once to prevent repeated DB queries
        $this->existingNos = Invoice::pluck('no')->map(fn($v) => trim($v))->toArray();
    }

    public function headingRow(): int
    {
        return 4;
    }

    public function model(array $row)
    {
        $amountFields = [
            'bill_amount', 'gst_tds_tax_rate', 'gst_tds_tax_amount', 'rate', 'amount',
            'taxable_amount', 'cgst_rate', 'cgst_amt', 'sgst_rate', 'sgst_amt',
            'igst_rate', 'igst_amt', 'tax_amount', 'round_off', 'freight'
        ];

        // Normalize keys and clean values
        $normalizedRow = [];
        foreach ($row as $key => $value) {
            $cleanKey = preg_replace('/[^a-z0-9_]/', '_', strtolower($key));
            $cleanKey = preg_replace('/_+/', '_', $cleanKey);

            if (in_array($cleanKey, $amountFields)) {
                $normalizedRow[$cleanKey] = $this->autoCleanCurrency($value);
            } else {
                $normalizedRow[$cleanKey] = $this->autoCleanCurrency($value);
            }
        }

        $no = trim($normalizedRow['no'] ?? '');

        if ($no === '') {
            // Skip rows with empty 'no'
            return null;
        }

        // Skip duplicates (existing in DB or already imported in this batch)
        if (in_array($no, $this->existingNos)) {
            $normalizedRow['reason'] = 'Duplicate no';
            $this->skippedRows[] = $normalizedRow;
            return null;
        }

        $this->existingNos[] = $no; // track to avoid duplicates in same import

        return new Invoice([
            'no' => $no,
            'date' => $this->convertDate($normalizedRow['date'] ?? null),
            'customer' => $normalizedRow['customer'] ?? null,
            'salesman' => $normalizedRow['salesman'] ?? null,
            'bill_amount' => $normalizedRow['bill_amount'] ?? null,
            'voucher_party_gst_no' => $normalizedRow['voucher_party_gst_no'] ?? null,
            'party_code' => $normalizedRow['party_code'] ?? null,
            'sales_gst_type' => $normalizedRow['sales_gst_type'] ?? null,
            'city' => $normalizedRow['city'] ?? null,
            'gst_tds_tax_rate' => $normalizedRow['gst_tds_tax_rate'] ?? null,
            'gst_tds_tax_amount' => $normalizedRow['gst_tds_tax_amount'] ?? null,
            'voucher_id' => $normalizedRow['voucher_id'] ?? null,
            'item' => $normalizedRow['item'] ?? null,
            'code' => $normalizedRow['code'] ?? null,
            'hsn_code' => $normalizedRow['hsn_code'] ?? null,
            'unit' => $normalizedRow['unit'] ?? null,
            'qty' => $normalizedRow['qty'] ?? null,
            'rate' => $normalizedRow['rate'] ?? null,
            'amount' => $normalizedRow['amount'] ?? null,
            'tax_code' => $normalizedRow['tax_code'] ?? null,
            'taxable_amount' => $normalizedRow['taxable_amount'] ?? null,
            'cgst_rate' => $normalizedRow['cgst_rate'] ?? null,
            'cgst_amt' => $normalizedRow['cgst_amt'] ?? null,
            'sgst_rate' => $normalizedRow['sgst_rate'] ?? null,
            'sgst_amt' => $normalizedRow['sgst_amt'] ?? null,
            'igst_rate' => $normalizedRow['igst_rate'] ?? null,
            'igst_amt' => $normalizedRow['igst_amt'] ?? null,
            'tax_amount' => $normalizedRow['tax_amount'] ?? null,
            'round_off' => $normalizedRow['round_off'] ?? null,
            'einvoice_no' => $normalizedRow['einvoice_no'] ?? null,
            'eway_bill_no' => $normalizedRow['eway_bill_no'] ?? null,
            'eway_bill_date' => $this->convertDate($normalizedRow['eway_bill_date'] ?? null),
            'freight' => $normalizedRow['freight'] ?? null,
            'destination' => $normalizedRow['destination'] ?? null,
        ]);
    }

    private function convertDate($value)
    {
        if (is_numeric($value)) {
            try {
                return ExcelDate::excelToDateTimeObject($value)->format('Y-m-d');
            } catch (\Exception $e) {
                return null;
            }
        }

        return !empty($value) ? date('Y-m-d', strtotime($value)) : null;
    }

    private function autoCleanCurrency($value)
    {
        if (is_null($value) || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return $value + 0;
        }

        if (is_string($value) && (str_contains($value, '₹') || str_contains($value, ',') || preg_match('/^\(.*\)$/', $value))) {
            $clean = str_replace(['₹', ',', ' '], '', $value);

            // Handle negative numbers in parentheses
            if (preg_match('/^\(.*\)$/', $value)) {
                $clean = '-' . trim($clean, '()');
            }

            if (is_numeric($clean)) {
                return (float)$clean;
            }
        }

        return $value;
    }
}
