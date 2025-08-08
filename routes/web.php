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

 
// use App\Http\Controllers\LoginController;

// Route::post('/api/login', [LoginController::class, 'login']);
Route::get('/check-zip', function () {
    if (class_exists('ZipArchive')) {
        return 'ZipArchive is available.';
    } else {
        return 'ZipArchive NOT available. Install php-zip.';
    }
});

Route::get('/test-excel', function () {
    if (class_exists(\Maatwebsite\Excel\Excel::class)) {
        return 'Excel package is installed ✅';
    } else {
        return 'Excel package is NOT installed ❌';
    }
});
