<?php
// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\DB;

// class ProductChartController extends Controller
// {
//     public function profitReport(Request $request)
//     {
//         $startDate    = $request->query('from_date');
//         $endDate      = $request->query('to_date');
//         $productName  = $request->query('product_name') ?: null;
//         $customerName = $request->query('customer_name') ?: null;
//         $salesmanName = $request->query('salesman_name') ?: null;

//         // -------------------------------
//         // 1. Get all unique products, customers, salesmen in date range
//         // -------------------------------
//         $query = DB::table('invoice_records');

//         if ($startDate && $endDate) {
//             $query->whereBetween('date', [$startDate, $endDate]);
//         }

//         $products = (clone $query)->distinct()->pluck('item')->toArray();
//         $customers = (clone $query)->distinct()->pluck('customer')->toArray();
//         $salesmen = (clone $query)->distinct()->pluck('salesman')->toArray();

//         // -------------------------------
//         // 2. Filtered invoice list for calculation
//         // -------------------------------
//         $invoiceQuery = DB::table('invoice_records')
//             ->when($startDate && $endDate, fn($q) => $q->whereBetween('date', [$startDate, $endDate]))
//             ->when($productName, fn($q) => $q->where('item', $productName))
//             ->when($customerName, fn($q) => $q->where('customer', $customerName))
//             ->when($salesmanName, fn($q) => $q->where('salesman', $salesmanName))
//             ->select('invoice_no', 'bill_amount', 'date', 'customer', 'salesman', 'item', 'qty');

//         $invoices = $invoiceQuery->get();

//         if ($invoices->isEmpty()) {
//             return response()->json([
//                 'filters' => [
//                     'products'  => $products,
//                     'customers' => $customers,
//                     'salesmen'  => $salesmen
//                 ],
//                 'data' => []
//             ]);
//         }

//         // -------------------------------
//         // 3. Overall totals
//         // -------------------------------
//         $uniqueInvoices = $invoices->unique('invoice_no');
//         $salesTotal = $uniqueInvoices->sum('bill_amount');

//         $costTotal = $invoices->sum(function($i) {
//             $price = DB::table('product_master')
//                 ->where('product_name', $i->item)
//                 ->value('price') ?? 0;
//             return $i->qty * $price;
//         });

//         $profitAmount = ($salesTotal / 1.18) - $costTotal;

//         $overallData = [
//             'sales' => round($salesTotal, 2),
//             'cost' => round($costTotal, 2),
//             'profit_amount' => round($profitAmount, 2),
//             'profit_percent' => $salesTotal > 0 ? round(($profitAmount / $salesTotal) * 100, 2) : 0,
//             'profit_percent_on_basic' => ($salesTotal / 1.18) > 0
//                 ? round(($profitAmount / ($salesTotal / 1.18)) * 100, 2)
//                 : 0
//         ];

//         // -------------------------------
//         // 4. Date-wise totals
//         // -------------------------------
//         $dateWise = $invoices->groupBy(function($inv) {
//             return date('Y-m-d', strtotime($inv->date));
//         })->map(function($dayInvoices, $date) {
//             $sales = collect($dayInvoices)->unique('invoice_no')->sum('bill_amount');
//             $cost = collect($dayInvoices)->sum(function($i) {
//                 $price = DB::table('product_master')
//                     ->where('product_name', $i->item)
//                     ->value('price') ?? 0;
//                 return $i->qty * $price;
//             });
//             $profitAmount = ($sales / 1.18) - $cost;

//             return [
//                 'date' => $date,
//                 'sales' => round($sales, 2),
//                 'cost' => round($cost, 2),
//                 'profit_amount' => round($profitAmount, 2),
//                 'profit_percent' => $sales > 0 ? round(($profitAmount / $sales) * 100, 2) : 0,
//                 'profit_percent_on_basic' => ($sales / 1.18) > 0
//                     ? round(($profitAmount / ($sales / 1.18)) * 100, 2)
//                     : 0
//             ];
//         })->values();

//         return response()->json([
//             'filters' => [
//                 'products'  => $products,
//                 'customers' => $customers,
//                 'salesmen'  => $salesmen
//             ],
//             'data' => empty($productName) && empty($customerName) && empty($salesmanName) && empty($startDate) && empty($endDate)
//                 ? [$overallData]
//                 : $dateWise
//         ]);
//     }
// }

 
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductChartController extends Controller
{
    public function profitReport(Request $request)
    {
        $startDate    = $request->query('from_date');
        $endDate      = $request->query('to_date');
        $productName  = $request->query('product_name') ?: null;
        $customerName = $request->query('customer_name') ?: null;
        $salesmanName = $request->query('salesman_name') ?: null;

        // -------------------------------
        // 1. Get all unique products, customers, salesmen
        // -------------------------------
        $query = DB::table('invoice_records');
        if ($startDate && $endDate) {
            $query->whereBetween('date', [$startDate, $endDate]);
        }
        $products  = (clone $query)->distinct()->pluck('item')->toArray();
        $customers = (clone $query)->distinct()->pluck('customer')->toArray();
        $salesmen  = (clone $query)->distinct()->pluck('salesman')->toArray();

        // -------------------------------
        // 2. Filtered invoice list for calculation
        // -------------------------------
        $invoiceQuery = DB::table('invoice_records')
            ->when($startDate && $endDate, fn($q) => $q->whereBetween('date', [$startDate, $endDate]))
            ->when($productName, fn($q) => $q->where('item', $productName))
            ->when($customerName, fn($q) => $q->where('customer', $customerName))
            ->when($salesmanName, fn($q) => $q->where('salesman', $salesmanName))
            ->select('invoice_no', 'bill_amount', 'date', 'customer', 'salesman', 'item', 'qty');

        $invoices = $invoiceQuery->get();

        if ($invoices->isEmpty()) {
            return response()->json([
                'filters' => [
                    'products'  => $products,
                    'customers' => $customers,
                    'salesmen'  => $salesmen
                ],
                'data' => []
            ]);
        }

        // -------------------------------
        // 3. Overall totals calculation
        // -------------------------------
        $uniqueInvoices = $invoices->unique('invoice_no');
        $salesTotal = $uniqueInvoices->sum('bill_amount');

        $costTotal = $invoices->sum(function($i) {
            $price = DB::table('product_master')
                ->where('product_name', $i->item)
                ->value('price') ?? 0;
            return $i->qty * $price;
        });

        $profitAmount = ($salesTotal / 1.18) - $costTotal;

        $overallData = [
            'sales' => round($salesTotal, 2),
            'cost' => round($costTotal, 2),
            'profit_amount' => round($profitAmount, 2),
            'profit_percent' => $salesTotal > 0 ? round(($profitAmount / $salesTotal) * 100, 2) : 0,
            'profit_percent_on_basic' => ($salesTotal / 1.18) > 0
                ? round(($profitAmount / ($salesTotal / 1.18)) * 100, 2)
                : 0
        ];

        // -------------------------------
        // 4. Date-wise totals (only if any filter applied)
        // -------------------------------
        $filtersApplied = $productName || $customerName || $salesmanName;

        $dateWise = $filtersApplied
            ? $invoices->groupBy(function($inv) { return date('Y-m-d', strtotime($inv->date)); })
                ->map(function($dayInvoices, $date) {
                    $sales = collect($dayInvoices)->unique('invoice_no')->sum('bill_amount');
                    $cost = collect($dayInvoices)->sum(function($i) {
                        $price = DB::table('product_master')
                            ->where('product_name', $i->item)
                            ->value('price') ?? 0;
                        return $i->qty * $price;
                    });
                    $profitAmount = ($sales / 1.18) - $cost;

                    return [
                        'date' => $date,
                        'sales' => round($sales, 2),
                        'cost' => round($cost, 2),
                        'profit_amount' => round($profitAmount, 2),
                        'profit_percent' => $sales > 0 ? round(($profitAmount / $sales) * 100, 2) : 0,
                        'profit_percent_on_basic' => ($sales / 1.18) > 0
                            ? round(($profitAmount / ($sales / 1.18)) * 100, 2)
                            : 0
                    ];
                })->values()
            : [];

        // -------------------------------
        // 5. Return response
        // -------------------------------
        // If first load OR date range with all filters → return overall
        // If any specific filter → return date-wise
        $returnData = ($filtersApplied || ($startDate && $endDate && !$productName && !$customerName && !$salesmanName))
            ? [$overallData]
            : $dateWise;

        return response()->json([
            'filters' => [
                'products'  => $products,
                'customers' => $customers,
                'salesmen'  => $salesmen
            ],
            'data' => $returnData
        ]);
    }

     public function profitReportDaily(Request $request)
    {
        $startDate    = $request->query('from_date');
        $endDate      = $request->query('to_date');
        $productName  = $request->query('product_name');
        $customerName = $request->query('customer_name');
        $salesmanName = $request->query('salesman_name');

        // Filters list
        $query = DB::table('invoice_records');
        if ($startDate && $endDate) {
            $query->whereBetween('date', [$startDate, $endDate]);
        }
        $products  = (clone $query)->distinct()->pluck('item')->toArray();
        $customers = (clone $query)->distinct()->pluck('customer')->toArray();
        $salesmen  = (clone $query)->distinct()->pluck('salesman')->toArray();

        // Invoices
        $invoices = DB::table('invoice_records as i')
            ->join('product_master as p', 'i.item', '=', 'p.product_name')
            ->select('i.date', 'i.invoice_no', 'i.bill_amount', 'i.qty', 'p.price')
            ->when($startDate && $endDate, fn($q) => $q->whereBetween('i.date', [$startDate, $endDate]))
            ->when($productName, fn($q) => $q->where('i.item', $productName))
            ->when($customerName, fn($q) => $q->where('i.customer', $customerName))
            ->when($salesmanName, fn($q) => $q->where('i.salesman', $salesmanName))
            ->get();

        if ($invoices->isEmpty()) {
            return response()->json([
                'filters' => [
                    'products'  => $products,
                    'customers' => $customers,
                    'salesmen'  => $salesmen
                ],
                'data' => []
            ]);
        }

        // Date-wise calculation
        $dateWise = $invoices->groupBy(fn($inv) => date('Y-m-d', strtotime($inv->date)))
            ->map(function ($dayInvoices, $date) {
                $sales = $dayInvoices->unique('invoice_no')->sum('bill_amount');
                $cost = $dayInvoices->sum(fn($i) => $i->qty * $i->price);
                $basicSales = $sales / 1.18;
                $profitAmount = $basicSales - $cost;

                return [
                    'date'                     => $date,
                    'sales'                    => round($sales, 2),
                    'cost'                     => round($cost, 2),
                    'profit_amount'            => round($profitAmount, 2),
                    'profit_percent'           => $sales > 0 ? round(($profitAmount / $sales) * 100, 2) : 0,
                    'profit_percent_on_basic'  => $basicSales > 0 ? round(($profitAmount / $basicSales) * 100, 2) : 0,
                ];
            })
            ->sortKeys()
            ->values();

        return response()->json([
            'filters' => [
                'products'  => $products,
                'customers' => $customers,
                'salesmen'  => $salesmen
            ],
            'data' => $dateWise
        ]);
    }
}
 

