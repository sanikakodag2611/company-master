<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('employee_master')->where('status', 'Active')->update(['status' => 1]);
        DB::table('employee_master')->where('status', 'Inactive')->update(['status' => 0]);

        Schema::table('employee_master', function (Blueprint $table) {
             $table->boolean('status')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('employee_master')->where('status', 1)->update(['status' => 'Active']);
        DB::table('employee_master')->where('status', 0)->update(['status' => 'Inactive']);

        Schema::table('employee_master', function (Blueprint $table) {
            $table->string('status')->change();
        });
    }
};
