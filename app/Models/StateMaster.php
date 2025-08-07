<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StateMaster extends Model
{
    protected $table = 'state_masters';

    protected $fillable = [
        'state_id',
        'state_name',
        'state_abbr',
        'state_ut',
        'country_id',
    ];

    public function country()
    {
        return $this->belongsTo(CountryMaster::class, 'country_id');
    }
}
