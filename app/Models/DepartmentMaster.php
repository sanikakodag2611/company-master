<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DepartmentMaster extends Model
{
    use HasFactory;

    protected $fillable = [
        'department_name',
        'department_abbreviation',
        'status'
    ];
}
