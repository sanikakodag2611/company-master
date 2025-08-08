<?php

namespace App\Imports;

use App\Models\Invoice;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
 

class InvoiceImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new Invoice([
            'no' => $row['No'] ?? null,
            'date' => $row['Date'] ?? null,
            'customer' => $row['Customer'] ?? null,
            'salesman' => $row['Salesman'] ?? null,
            'bill_amount' => $row['Bill Amount(₹)'] ?? null,
            'voucher_party_gst_no' => $row['voucher_party_gst_no'] ?? null,
            'party_code' => $row['Party Code'] ?? null,
            'sales_gst_type' => $row['sales_gst_type'] ?? null,
            'city' => $row['City'] ?? null,
            'gst_tds_tax_rate' => $row['GST TDS Tax Rate(₹)'] ?? null,
            'gst_tds_tax_amount' => $row['GST TDS Tax Amount(₹)'] ?? null,
            'voucher_id' => $row['voucher_id'] ?? null,
            'item' => $row['Item'] ?? null,
            'code' => $row['Code'] ?? null,
            'hsn_code' => $row['HSN Code'] ?? null,
            'unit' => $row['Unit'] ?? null,
            'qty' => $row['Qty'] ?? null,
            'rate' => $row['Rate'] ?? null,
            'amount' => $row['Amount(₹)'] ?? null,
            'tax_code' => $row['Tax Code'] ?? null,
            'taxable_amount' => $row['Taxable Amount(₹)'] ?? null,
            'cgst_rate' => $row['CGST Rate'] ?? null,
            'cgst_amt' => $row['CGST Amt(₹)'] ?? null,
            'sgst_rate' => $row['SGST Rate'] ?? null,
            'sgst_amt' => $row['SGST Amt(₹)'] ?? null,
            'igst_rate' => $row['IGST Rate'] ?? null,
            'igst_amt' => $row['IGST Amt(₹)'] ?? null,
            'tax_amount' => $row['Tax Amount(₹)'] ?? null,
            'round_off' => $row['Round Off(₹)'] ?? null,
            'einvoice_no' => $row['Einvoice No'] ?? null,
            'eway_bill_no' => $row['Eway Bill No'] ?? null,
            'eway_bill_date' => $row['Eway Bill Date'] ?? null,
            'freight' => $row['freight'] ?? null,
            'destination' => $row['destination'] ?? null,
        ]);
    }

    public function headingRow(): int
    {
        return 4;
    }
}
