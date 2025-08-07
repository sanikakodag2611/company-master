<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Session;

class BaseController extends Controller
{
    protected function getCompanyId()
    {
        return Session::get('company_id');
    }

    protected function getYearId()
    {
        return Session::get('year_id');
    }

     
}
