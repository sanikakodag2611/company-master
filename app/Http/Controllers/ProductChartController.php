<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductChartController extends Controller
{
    public function profitReport(Request $request)
    {
        $startDate    = $request->query('from_date');
        $endDate      = $request->query('to_date');
        $productName  = $request->query('product_name');
        $customerName = $request->query('customer_name'); 
        $salesmanName = $request->query('salesman_name');  
 
        $subQuery = DB::table('invoice_records')
            ->select('invoice_no', 'bill_amount', 'date', 'customer', 'salesman', 'item', 'qty', 'tax_amount')
            ->distinct();

            // return $subQuery;

        // $subQuery = DB::table('invoice_records')
        // ->select('invoice_no', 'bill_amount', 'date', 'customer', 'salesman','item', 'qty', 'tax_amount')
        // ->groupBy('invoice_no');


        $query = DB::table(DB::raw("({$subQuery->toSql()}) as i"))
            ->mergeBindings($subQuery)
            ->join('product_master as p', 'i.item', '=', 'p.product_name')
            ->whereBetween('i.date', [$startDate, $endDate]);

        if (!empty($productName)) {
            $query->where('p.product_name', $productName);
        }
        if (!empty($customerName)) {
            $query->where('i.customer', $customerName);
        }
        if (!empty($salesmanName)) {
            $query->where('i.salesman', $salesmanName);
        }

        // Check if all filters are empty -> return overall single row
        $isOverall = empty($productName) && empty($customerName) && empty($salesmanName);

        if ($isOverall) {
            $data = $query->select(
                DB::raw('SUM(i.bill_amount) as revenue'),
                DB::raw('SUM(i.qty * p.price) as cost'),
                DB::raw('SUM(i.bill_amount - i.tax_amount) - SUM(i.qty * p.price) as profit'),
                DB::raw('ROUND((SUM(i.bill_amount - i.tax_amount) - SUM(i.qty * p.price)) / SUM(i.bill_amount - i.tax_amount) * 100, 2) as profit_rate')
            )->first();

            // Return as single-row array for consistency
            return response()->json([
                [
                    'revenue'     => round($data->revenue, 2),
                    'cost'        => round($data->cost, 2),
                    'profit'      => round($data->profit, 2),
                    'profit_rate' => round($data->profit_rate, 2)
                ]
            ]);
        }

        // Else -> return date-wise grouped data
        $data = $query->select(
                DB::raw('DATE(i.date) as date'), 
                DB::raw('SUM(i.bill_amount) as revenue'),
                DB::raw('SUM(i.qty * p.price) as cost')
            )
            ->groupBy(DB::raw('DATE(i.date)'))
            ->orderBy('date')
            ->get();

        // Format date-wise result
        $result = $data->map(fn($row) => [
            'date'        => $row->date,
            'revenue'     => round($row->revenue, 2),
            'cost'        => round($row->cost, 2),
            'profit'      => round($row->revenue - $row->cost, 2),
            'profit_rate' => $row->revenue > 0
                ? round((($row->revenue - $row->cost) / $row->revenue) * 100, 2)
                : 0,
        ]);

        return response()->json($result->toArray());
    }
}
