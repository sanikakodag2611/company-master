<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class YearMaster extends Model
{
    protected $fillable = [
        'year_name', 'year_abbreviation', 'opening_date', 'closing_date', 'status',
    ];
}
