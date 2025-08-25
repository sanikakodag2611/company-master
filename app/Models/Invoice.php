<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $table = 'invoice_records';

    
    protected $fillable = [
        'invoice_no',
        'date',
        'customer',
        'salesman',
        'bill_amount',
        'party_code',
        'item',
        'unit',
        'qty',
        'rate',
        'amount',
        'tax_per',
        'tax_amount',
        'destination',
        'hsn_code',
        'freight',
        'city',     
        'transport',
        'commission',
    ];

    protected $casts = [
        'bill_amount' => 'float',
        'rate' => 'float',
        'amount' => 'float',
        'tax_per' => 'float',
        'tax_amount' => 'float', 
        'freight' => 'float',
        'qty' => 'integer', 
        'transport' => 'float',
        'commission' => 'float',  
    ];
}
