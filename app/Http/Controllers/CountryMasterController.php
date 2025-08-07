<?php

namespace App\Http\Controllers;

use App\Models\CountryMaster;
use Illuminate\Http\Request;

class CountryMasterController extends Controller
{
    public function index()
    {
        return response()->json(CountryMaster::all());
    }
}
