<?php
 
namespace App\Http\Controllers;

use App\Models\StateMaster;
use Illuminate\Http\Request;

class StateController extends Controller
{
    public function index()
    {
        return response()->json(StateMaster::all());
    }
}

