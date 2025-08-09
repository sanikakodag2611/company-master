<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AugustInvoice extends Model
{
    protected $table = 'august_invoices';

    protected $fillable = [
        'No',
        'Date',
        'Customer',
        'Salesman',
        'Bill Amount(₹)',
        'voucher_party_gst_no',
        'Party Code',
        'sales_gst_type',
        'City',
        'GST TDS Tax Rate(₹)',
        'GST TDS Tax Amount(₹)',
        'voucher_id',
        'Item',
        'Code',
        'HSN Code',
        'Unit',
        'Qty',
        'Rate',
        'Amount(₹)',
        'Tax Code',
        'Taxable Amount(₹)',
        'CGST Rate',
        'CGST Amt(₹)',
        'SGST Rate',
        'SGST Amt(₹)',
        'IGST Rate',
        'IGST Amt(₹)',
        'Tax Amount(₹)',
        'Round Off(₹)',
        'Einvoice No',
        'Eway Bill No',
        'Eway Bill Date',
        'freight',
        'destination',
    ];

    public $timestamps = false;
}
