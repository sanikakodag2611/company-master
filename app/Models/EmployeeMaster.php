<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeMaster extends Model
{
    protected $table = 'employee_master';

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

    public function login()
    {
        return $this->hasOne(LoginMaster::class, 'employee_id');
    }

}
