<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeMasterController;
use App\Http\Controllers\CompanyMasterController;
use App\Http\Controllers\DepartmentMasterController;
use App\Http\Controllers\DesignationMasterController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('company',[CompanyMasterController::class,'create']);
Route::post('/company', [CompanyMasterController::class, 'create']);
Route::get('/company/{id}', [CompanyMasterController::class, 'show']);
Route::put('/company/{id}', [CompanyMasterController::class, 'update']);
Route::delete('/company/{id}', [CompanyMasterController::class, 'destroy']);
 
Route::post('/departments', [DepartmentMasterController::class, 'store']);
Route::get('/departments', [DepartmentMasterController::class, 'index']);
Route::get('/departments/{id}', [DepartmentMasterController::class, 'show']);
Route::put('/departments/{id}', [DepartmentMasterController::class, 'update']);
Route::delete('/departments/{id}', [DepartmentMasterController::class, 'destroy']);
 
Route::post('/designation', [DesignationMasterController::class, 'store']);
Route::get('/designation', [DesignationMasterController::class, 'index']);
Route::get('/designation/{id}', [DesignationMasterController::class, 'show']);
Route::put('/designation/{id}', [DesignationMasterController::class, 'update']);
Route::delete('/designation/{id}', [DesignationMasterController::class, 'destroy']);
 
Route::post('/employee', [EmployeeMasterController::class, 'store']);
Route::get('/employee/{id}', [EmployeeMasterController::class, 'show']);
Route::put('/employee/{id}', [EmployeeMasterController::class, 'update']);
Route::delete('/employee/{id}', [EmployeeMasterController::class, 'destroy']);
