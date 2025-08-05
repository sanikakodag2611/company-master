<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserMaster extends Model
{
    protected $fillable = [
        'employee_name',
        'email',
        'contact_no',
        'address',
        'date_of_birth',
        'gender',
        'state_id',
        'city',
        'pan_card',
        'designation_id',
        'department_id',
        'status',
    ];
}
