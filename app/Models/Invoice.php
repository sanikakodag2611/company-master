<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $table = 'invoices';
    protected $fillable = [
        'no',
        'date',
        'customer',
        'salesman',
        'bill_amount',
        'voucher_party_gst_no',
        'party_code',
        'sales_gst_type',
        'city',
        'gst_tds_tax_rate',
        'gst_tds_tax_amount',
        'voucher_id',
        'item',
        'code',
        'hsn_code',
        'unit',
        'qty',
        'rate',
        'amount',
        'tax_code',
        'taxable_amount',
        'cgst_rate',
        'cgst_amt',
        'sgst_rate',
        'sgst_amt',
        'igst_rate',
        'igst_amt',
        'tax_amount',
        'round_off',
        'einvoice_no',
        'eway_bill_no',
        'eway_bill_date',
        'freight',
        'destination',
    ];
}
