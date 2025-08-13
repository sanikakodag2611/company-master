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
    Schema::create('invoice_records', function (Blueprint $table) {
        $table->id();

        $table->string('invoice_no')->nullable()->index();

        $table->date('date')->nullable();
        $table->string('customer')->nullable();
        $table->string('salesman')->nullable();
        $table->decimal('bill_amount', 15, 2)->nullable();
        $table->string('party_code')->nullable();
        $table->string('item')->nullable();
        $table->string('unit')->nullable();
        $table->integer('qty')->nullable();
        $table->decimal('rate', 15, 2)->nullable();
        $table->decimal('amount', 15, 2)->nullable();
        $table->decimal('tax_per', 10, 2)->nullable();
        $table->decimal('tax_amount', 15, 2)->nullable();
        $table->string('destination')->nullable();
        $table->string('hsn_code')->nullable();
        $table->decimal('freight', 15, 2)->nullable();
        $table->string('city')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
{
    Schema::dropIfExists('invoice_records');
}

};
