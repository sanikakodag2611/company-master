<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DistrictMaster extends Model
{
    use HasFactory;
    protected $table = 'district_master';

    protected $fillable = [
        'dist_name',
        'abbreviation',
        'status',
    ];
}
