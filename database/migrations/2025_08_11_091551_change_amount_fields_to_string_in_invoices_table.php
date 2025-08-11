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
        Schema::table('invoices', function (Blueprint $table) {
             $table->string('bill_amount')->change();
            $table->string('gst_tds_tax_rate')->change();
            $table->string('gst_tds_tax_amount')->change();
            $table->string('rate')->change();
            $table->string('amount')->change();
            $table->string('taxable_amount')->change();
            $table->string('cgst_rate')->change();
            $table->string('cgst_amt')->change();
            $table->string('sgst_rate')->change();
            $table->string('sgst_amt')->change();
            $table->string('igst_rate')->change();
            $table->string('igst_amt')->change();
            $table->string('tax_amount')->change();
            $table->string('round_off')->change();
            $table->string('freight')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
             $table->decimal('bill_amount', 15, 2)->change();
            $table->decimal('gst_tds_tax_rate', 15, 2)->change();
            $table->decimal('gst_tds_tax_amount', 15, 2)->change();
            $table->decimal('rate', 15, 2)->change();
            $table->decimal('amount', 15, 2)->change();
            $table->decimal('taxable_amount', 15, 2)->change();
            $table->decimal('cgst_rate', 15, 2)->change();
            $table->decimal('cgst_amt', 15, 2)->change();
            $table->decimal('sgst_rate', 15, 2)->change();
            $table->decimal('sgst_amt', 15, 2)->change();
            $table->decimal('igst_rate', 15, 2)->change();
            $table->decimal('igst_amt', 15, 2)->change();
            $table->decimal('tax_amount', 15, 2)->change();
            $table->decimal('round_off', 15, 2)->change();
            $table->decimal('freight', 15, 2)->change();
        });
    }
};
