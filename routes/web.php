<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DepartmentMasterController;

Route::get('/', function () {
    return view('welcome');
});
 
Route::get('/department', [DepartmentMasterController::class, 'index'])->name('department.index');
Route::get('/department/create', [DepartmentMasterController::class, 'create'])->name('department.create');
Route::post('/department/store', [DepartmentMasterController::class, 'store'])->name('department.store');
Route::get('/department/edit/{id}', [DepartmentMasterController::class, 'edit'])->name('department.edit');
Route::post('/department/update/{id}', [DepartmentMasterController::class, 'update'])->name('department.update');
Route::post('/department/destroy/{id}', [DepartmentMasterController::class, 'destroy'])->name('department.destroy');