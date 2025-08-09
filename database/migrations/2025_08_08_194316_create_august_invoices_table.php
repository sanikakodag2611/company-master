<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateAugustInvoicesTable extends Migration
{
    public function up()
    {
        DB::statement('
            CREATE TABLE august_invoices (
                `No` VARCHAR(255) NULL,
                `Date` DATE NULL,
                `Customer` VARCHAR(255) NULL,
                `Salesman` VARCHAR(255) NULL,
                `Bill Amount(₹)` DECIMAL(15,2) NULL,
                `voucher_party_gst_no` VARCHAR(255) NULL,
                `Party Code` VARCHAR(255) NULL,
                `sales_gst_type` VARCHAR(255) NULL,
                `City` VARCHAR(255) NULL,
                `GST TDS Tax Rate(₹)` DECIMAL(15,2) NULL,
                `GST TDS Tax Amount(₹)` DECIMAL(15,2) NULL,
                `voucher_id` VARCHAR(255) NULL,
                `Item` VARCHAR(255) NULL,
                `Code` VARCHAR(255) NULL,
                `HSN Code` VARCHAR(255) NULL,
                `Unit` VARCHAR(255) NULL,
                `Qty` DECIMAL(15,2) NULL,
                `Rate` DECIMAL(15,2) NULL,
                `Amount(₹)` DECIMAL(15,2) NULL,
                `Tax Code` VARCHAR(255) NULL,
                `Taxable Amount(₹)` DECIMAL(15,2) NULL,
                `CGST Rate` DECIMAL(5,2) NULL,
                `CGST Amt(₹)` DECIMAL(15,2) NULL,
                `SGST Rate` DECIMAL(5,2) NULL,
                `SGST Amt(₹)` DECIMAL(15,2) NULL,
                `IGST Rate` DECIMAL(5,2) NULL,
                `IGST Amt(₹)` DECIMAL(15,2) NULL,
                `Tax Amount(₹)` DECIMAL(15,2) NULL,
                `Round Off(₹)` DECIMAL(15,2) NULL,
                `Einvoice No` VARCHAR(255) NULL,
                `Eway Bill No` VARCHAR(255) NULL,
                `Eway Bill Date` DATE NULL,
                `freight` DECIMAL(15,2) NULL,
                `destination` VARCHAR(255) NULL,
                `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        ');
    }

    public function down()
    {
        Schema::dropIfExists('august_invoices');
    }
}
