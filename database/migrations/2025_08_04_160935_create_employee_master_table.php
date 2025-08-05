<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_master', function (Blueprint $table) {
            $table->id();
            $table->string('employee_name');
            $table->string('email')->unique();
            $table->string('contact_no', 15)->unique();
            $table->string('address')->nullable();
            $table->date('date_of_birth');
            $table->string('gender');
            $table->unsignedBigInteger('state_id');
            $table->string('city');
            $table->string('pan_card', 10)->unique();
            $table->unsignedBigInteger('designation_id');
            $table->unsignedBigInteger('department_id');
            $table->string('status');  
            $table->timestamps();
            
            $table->foreign('state_id')->references('state_id')->on('state_masters')->onDelete('cascade');
            $table->foreign('designation_id')->references('id')->on('designation_masters')->onDelete('cascade');
            $table->foreign('department_id')->references('id')->on('department_masters')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_master');
    }
};
