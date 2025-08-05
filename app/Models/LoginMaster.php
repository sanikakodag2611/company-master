<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class LoginMaster extends Authenticatable
{
    protected $fillable = [
        'employee_id',
        'username',
        'password',
        'status',
    ];

    protected $hidden = [
        'password',
    ];

    public function employee()
    {
        return $this->belongsTo(EmployeeMaster::class, 'employee_id');
    }
}
