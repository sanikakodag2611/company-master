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
        Schema::create('product_master', function (Blueprint $table) {
            $table->id();
            $table->string('product_name')->nullable();
            $table->string('code')->unique()->nullable();
            $table->string('hsn_code')->unique()->nullable();
            $table->decimal('price', 15, 2)->nullable();
            $table->unsignedBigInteger('company_id');
            $table->timestamps();

            $table->foreign('company_id')
                  ->references('id')
                  ->on('company_masters')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_master');
    }
};
