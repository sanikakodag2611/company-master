<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StateController;
use App\Http\Middleware\AttachCompanyYear;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\YearMasterController;
use App\Http\Controllers\LoginMasterController;
use App\Http\Controllers\ProductChartController;
use App\Http\Controllers\CompanyMasterController;
use App\Http\Controllers\CountryMasterController;
use App\Http\Controllers\ProductMasterController;
use App\Http\Controllers\DistrictMasterController;
use App\Http\Controllers\EmployeeMasterController;
use App\Http\Controllers\DepartmentMasterController;
use App\Http\Controllers\DesignationMasterController;
use App\Http\Controllers\InvoiceDataUploadController; 

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('login',[LoginMasterController::class,'login']);
Route::middleware('auth:sanctum')->post('/logout', [LoginMasterController::class, 'logout']);

Route::get('company',[CompanyMasterController::class,'index']);
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
  
// Route::post('/employee', [EmployeeMasterController::class, 'store'])->middleware('auth:sanctum');
// Route::get('/employee/{id}', [EmployeeMasterController::class, 'show']);
// Route::put('/employee/{id}', [EmployeeMasterController::class, 'update']);
// Route::delete('/employee/{id}', [EmployeeMasterController::class, 'destroy']);
 
// Route::middleware(['auth:sanctum', 'AttachCompanyYear'])->group(function () {
//     Route::post('/employee', [EmployeeMasterController::class, 'store']);
//     Route::get('/employee/{id}', [EmployeeMasterController::class, 'show']);
//     Route::put('/employee/{id}', [EmployeeMasterController::class, 'update']);
//     Route::delete('/employee/{id}', [EmployeeMasterController::class, 'destroy']);
// });

// Route::middleware(['auth:sanctum', 'api-session'])->group(function () {
//     Route::post('/employee', [EmployeeMasterController::class, 'store']);
//     Route::get('/employee/{id}', [EmployeeMasterController::class, 'show']);
//     Route::put('/employee/{id}', [EmployeeMasterController::class, 'update']);
//     Route::delete('/employee/{id}', [EmployeeMasterController::class, 'destroy']);
// });

// Route::middleware(['auth:sanctum'])->group(function () {
//     Route::post('/employee', [EmployeeMasterController::class, 'store']);
//     Route::get('/employee/{id}', [EmployeeMasterController::class, 'show']);
//     Route::put('/employee/{id}', [EmployeeMasterController::class, 'update']);
//     Route::delete('/employee/{id}', [EmployeeMasterController::class, 'destroy']);
// });
// Route::middleware(['check.companyyear'])->group(function () {
// // Route::middleware(['auth:sanctum', 'check.session'])->group(function () {
//     Route::post('/employee', [EmployeeMasterController::class, 'store']);
//     Route::get('/employee/{id}', [EmployeeMasterController::class, 'show']);
//     Route::put('/employee/{id}', [EmployeeMasterController::class, 'update']);
//     Route::delete('/employee/{id}', [EmployeeMasterController::class, 'destroy']);
// });

Route::post('/login', [LoginMasterController::class, 'login']);

 
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LoginMasterController::class, 'logout']);
 
    Route::post('/employee', [EmployeeMasterController::class, 'store']);
    Route::get('/employee/{id}', [EmployeeMasterController::class, 'show']);
    Route::put('/employee/{id}', [EmployeeMasterController::class, 'update']);
    Route::delete('/employee/{id}', [EmployeeMasterController::class, 'destroy']);
});
Route::post('/employees/public-create', [EmployeeMasterController::class, 'store']);

Route::get('/years', [YearMasterController::class, 'index']);
Route::post('/years', [YearMasterController::class, 'store']);
Route::put('/years/{id}', [YearMasterController::class, 'update']);
Route::delete('/years/{id}', [YearMasterController::class, 'destroy']);

    
Route::get('/states', [StateController::class, 'index']);

Route::get('/countries', [CountryMasterController::class, 'index']);
Route::get('/states', [StateController::class, 'index']);
 

Route::post('/upload', [InvoiceDataUploadController::class, 'upload']);
Route::get('/invoices', [InvoiceController::class, 'index']); 
 
Route::post('/invoices/import', [InvoiceController::class, 'import'])->name('invoices.import');

Route::post('/upload-invoice', [InvoiceController::class, 'import']);
Route::get('/invoices', [InvoiceController::class, 'index']);
Route::post('/invoices/update-duplicates', [InvoiceController::class, 'updateDuplicates']);
 
  
Route::get('/products', [ProductMasterController::class, 'index']);       
Route::post('/products', [ProductMasterController::class, 'store']);     
Route::get('/products/{id}', [ProductMasterController::class, 'show']);   
Route::put('/products/{id}', [ProductMasterController::class, 'update']);  
Route::delete('/products/{id}', [ProductMasterController::class, 'destroy']);  


Route::get('/districts', [DistrictMasterController::class, 'index']);       
Route::post('/districts', [DistrictMasterController::class, 'store']);     
Route::get('/districts/{id}', [DistrictMasterController::class, 'show']);   
Route::put('/districts/{id}', [DistrictMasterController::class, 'update']);  
Route::delete('/districts/{id}', [DistrictMasterController::class, 'destroy']);  


Route::get('/profit-chart', [ProductChartController::class, 'profitReport']);