<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('invoices', function (Blueprint $table) {
        $table->id();
        $table->string('no')->nullable();
        $table->date('date')->nullable();
        $table->string('customer')->nullable();
        $table->string('salesman')->nullable();
        $table->decimal('bill_amount', 15, 2)->nullable();
        $table->string('voucher_party_gst_no')->nullable();
        $table->string('party_code')->nullable();
        $table->string('sales_gst_type')->nullable();
        $table->string('city')->nullable();
        $table->decimal('gst_tds_tax_rate', 10, 2)->nullable();
        $table->decimal('gst_tds_tax_amount', 15, 2)->nullable();
        $table->string('voucher_id')->nullable();
        $table->string('item')->nullable();
        $table->string('code')->nullable();
        $table->string('hsn_code')->nullable();
        $table->string('unit')->nullable();
        $table->integer('qty')->nullable();
        $table->decimal('rate', 15, 2)->nullable();
        $table->decimal('amount', 15, 2)->nullable();
        $table->string('tax_code')->nullable();
        $table->decimal('taxable_amount', 15, 2)->nullable();
        $table->decimal('cgst_rate', 10, 2)->nullable();
        $table->decimal('cgst_amt', 15, 2)->nullable();
        $table->decimal('sgst_rate', 10, 2)->nullable();
        $table->decimal('sgst_amt', 15, 2)->nullable();
        $table->decimal('igst_rate', 10, 2)->nullable();
        $table->decimal('igst_amt', 15, 2)->nullable();
        $table->decimal('tax_amount', 15, 2)->nullable();
        $table->decimal('round_off', 15, 2)->nullable();
        $table->string('einvoice_no')->nullable();
        $table->string('eway_bill_no')->nullable();
        $table->date('eway_bill_date')->nullable();
        $table->decimal('freight', 15, 2)->nullable();
        $table->string('destination')->nullable();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
