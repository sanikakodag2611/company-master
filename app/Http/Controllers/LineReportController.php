<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LineReportController extends Controller
{
    /**
     * Fetches and prepares profit report data for a given date range.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function profitReport(Request $request)
    {
        // Get start and end dates from the request, default to a sensible range if not provided
        $startDate = $request->query('from_date', now()->subDays(30)->toDateString());
        $endDate   = $request->query('to_date', now()->toDateString());

        // Join invoice records with product master to get cost data
        $data = DB::table('invoice_records as i')
            ->join('product_master as p', 'i.item', '=', 'p.product_name')
            ->select(
                DB::raw('DATE(i.date) as date'),
                DB::raw('SUM(i.bill_amount) as sales'),
                DB::raw('SUM(i.qty * p.price) as cost')
            )
            ->whereBetween('i.date', [$startDate, $endDate])
            ->groupBy(DB::raw('DATE(i.date)'))
            ->orderBy('date')
            ->get();

        // Process the fetched data to calculate profit and percentages
        $result = $data->map(function ($row) {
            $profit = $row->sales - $row->cost;

            // Calculate profit percentages, handling division by zero
            $profitOnSales = $row->sales > 0 ? ($profit / $row->sales) * 100 : 0;
            $profitOnCost = $row->cost > 0 ? ($profit / $row->cost) * 100 : 0;
            
            return [
                'date' => $row->date,
                'sales' => round($row->sales, 2),
                'cost' => round($row->cost, 2),
                'profit_amount' => round($profit, 2),
                'profit_percent' => round($profitOnSales, 2),
                'profit_percent_on_basic' => round($profitOnCost, 2),
            ];
        });

        // Return a JSON response with the final, formatted data array
        return response()->json([
            'data' => $result,
        ]);
    }
}
