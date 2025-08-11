<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;  // Allow everyone, adjust if needed
    }

    public function rules()
    {
         $user = $this->user();
        return [
            
            'employee_name' => 'required|string',
            'email' => 'required|email|unique:employee_master,email',
            'username' => 'required|string|unique:employee_master,username',
            'password' => 'required|min:6',
            'contact_no' => 'required|string|max:15|unique:employee_master,contact_no',
            'address' => 'nullable|string',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:Male,Female,Other',
            'state_id' => 'required|exists:state_masters,state_id',
            'company_id' => $user ? 'nullable|exists:company_masters,id' : 'required|exists:company_masters,id',
            'year_id' => $user ? 'nullable|exists:year_masters,id' : 'required|exists:year_masters,id',

            'city' => 'required|string',
            'pan_card' => [
                'required',
                'string',
                'size:10',
                'regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/',
                'unique:employee_master,pan_card'
            ],
            'designation_id' => 'required|exists:designation_masters,id',
            'department_id' => 'required|exists:department_masters,id',
            'status' => 'required|in:0,1',
        ];
    }
}
