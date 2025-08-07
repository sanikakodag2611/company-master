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
        Schema::table('employee_master', function (Blueprint $table) {
            $table->string('username')->nullable()->after('email');
            $table->string('password')->nullable()->after('username');
        });

        Schema::table('employee_master', function (Blueprint $table) {
            $table->unique('username');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employee_master', function (Blueprint $table) {
            $table->dropColumn(['username', 'password']);
        });
    }
};
