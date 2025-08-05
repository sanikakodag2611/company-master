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
        Schema::create('company_masters', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('contact_person');
            $table->unsignedBigInteger('state_id');
            $table->unsignedBigInteger('country_id');
            $table->string('city')->nullable();
            $table->text('company_address')->nullable();
            $table->string('gstin_uin',15)->unique();
            $table->string('pan_no', 10)->unique();
            $table->string('contact_no', 15)->unique();
            $table->string('email')->unique();
            $table->string('website')->nullable();
            $table->timestamps();

            $table->foreign('state_id')->references('state_id')->on('state_masters')->onDelete('cascade');
            $table->foreign('country_id')->references('country_id')->on('country_masters')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_masters');
    }
};
