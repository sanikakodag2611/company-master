<?php
 
namespace App\Imports;

use App\Models\AugustInvoice;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class AugustInvoiceImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new AugustInvoice([
            'No' => $row['No'] ?? null,
            'Date' => $row['Date'] ?? null,
            'Customer' => $row['Customer'] ?? null,
            'Salesman' => $row['Salesman'] ?? null,
            'Bill Amount(₹)' => $row['Bill Amount(₹)'] ?? null,
            'voucher_party_gst_no' => $row['voucher_party_gst_no'] ?? null,
            'Party Code' => $row['Party Code'] ?? null,
            'sales_gst_type' => $row['sales_gst_type'] ?? null,
            'City' => $row['City'] ?? null,
            'GST TDS Tax Rate(₹)' => $row['GST TDS Tax Rate(₹)'] ?? null,
            'GST TDS Tax Amount(₹)' => $row['GST TDS Tax Amount(₹)'] ?? null,
            'voucher_id' => $row['voucher_id'] ?? null,
            'Item' => $row['Item'] ?? null,
            'Code' => $row['Code'] ?? null,
            'HSN Code' => $row['HSN Code'] ?? null,
            'Unit' => $row['Unit'] ?? null,
            'Qty' => $row['Qty'] ?? null,
            'Rate' => $row['Rate'] ?? null,
            'Amount(₹)' => $row['Amount(₹)'] ?? null,
            'Tax Code' => $row['Tax Code'] ?? null,
            'Taxable Amount(₹)' => $row['Taxable Amount(₹)'] ?? null,
            'CGST Rate' => $row['CGST Rate'] ?? null,
            'CGST Amt(₹)' => $row['CGST Amt(₹)'] ?? null,
            'SGST Rate' => $row['SGST Rate'] ?? null,
            'SGST Amt(₹)' => $row['SGST Amt(₹)'] ?? null,
            'IGST Rate' => $row['IGST Rate'] ?? null,
            'IGST Amt(₹)' => $row['IGST Amt(₹)'] ?? null,
            'Tax Amount(₹)' => $row['Tax Amount(₹)'] ?? null,
            'Round Off(₹)' => $row['Round Off(₹)'] ?? null,
            'Einvoice No' => $row['Einvoice No'] ?? null,
            'Eway Bill No' => $row['Eway Bill No'] ?? null,
            'Eway Bill Date' => $row['Eway Bill Date'] ?? null,
            'freight' => $row['freight'] ?? null,
            'destination' => $row['destination'] ?? null,
        ]);
    }

    public function headingRow(): int
    {
        return 4;
    }
}
