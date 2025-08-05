<?php 
 
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DesignationMaster extends Model
{
    protected $fillable = [
        'designation_name',
        'designation_abbreviation',
    ];
}
