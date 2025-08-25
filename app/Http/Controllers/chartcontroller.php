<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
 
// class chartcontroller extends Controller
// {
//     // =========================
//     // 1. Date-wise
//     // =========================
//     public function dateWise(Request $request)
//     {
//         $invoices = $this->getInvoices($request)->groupBy(fn($i) => date('Y-m-d', strtotime($i->date)));

//         return response()->json(
//             $invoices->map(fn($group, $date) => $this->calculateGroup($group, ['date'=>$date]))->values()
//         );
//     }

//     // =========================
//     // 2. City-wise
//     // =========================
//     public function cityWise(Request $request)
//     {
//         $invoices = $this->getInvoices($request)->groupBy(fn($i) => trim($i->city));

//         return response()->json(
//             $invoices->map(fn($group, $city) => $this->calculateGroup($group, ['city'=>$city]))
//                      ->sortByDesc('sales')
//                      ->values()
//         );
//     }

//     // =========================
//     // 3. Salesman-wise
//     // =========================
//     public function salesmanWise(Request $request)
//     {
//         $invoices = $this->getInvoices($request)->groupBy(fn($i) => trim($i->salesman));

//         return response()->json(
//             $invoices->map(fn($group, $salesman) => $this->calculateGroup($group, ['salesman'=>$salesman]))
//                      ->sortByDesc('sales')
//                      ->values()
//         );
//     }

//     // =========================
//     // 4. Drilldown: City → Salesmen
//     // =========================
//     public function salesmenInCity(Request $request)
//     {
//         $city = $request->query('city');

//         $invoices = $this->getInvoices($request)
//                          ->where('city', $city)
//                          ->groupBy(fn($i) => trim($i->salesman));

//         return response()->json(
//             $invoices->map(fn($group, $salesman) => $this->calculateGroup($group, ['city'=>$city,'salesman'=>$salesman]))
//                      ->sortByDesc('sales')
//                      ->values()
//         );
//     }

//     // =========================
//     // 5. Drilldown: City → Salesman → Date
//     // =========================
//     public function salesmanDates(Request $request)
//     {
//         $city     = $request->query('city');
//         $salesman = $request->query('salesman');

//         $invoices = $this->getInvoices($request)
//                          ->where('city', $city)
//                          ->where('salesman', $salesman)
//                          ->groupBy(fn($i) => date('Y-m-d', strtotime($i->date)));

//         return response()->json(
//             $invoices->map(fn($group, $date) => $this->calculateGroup($group, ['date'=>$date]))->values()
//         );
//     }

//     // =========================
//     // 6. Drilldown: Salesman → Cities
//     // =========================
//     public function salesmanInCities(Request $request)
//     {
//         $salesman = $request->query('salesman');

//         $invoices = $this->getInvoices($request)
//                          ->where('salesman', $salesman)
//                          ->groupBy(fn($i) => trim($i->city));

//         return response()->json(
//             $invoices->map(fn($group, $city) => $this->calculateGroup($group, ['salesman'=>$salesman,'city'=>$city]))
//                      ->sortByDesc('sales')
//                      ->values()
//         );
//     }

//     // =========================
//     // Totals
//     // =========================
//     public function totals(Request $request)
//     {
//         $invoices = $this->getInvoices($request);

//         $totalSales  = $invoices->sum('amount');
//         $totalCost   = $invoices->sum(fn($i) => ($i->qty*$i->price)+$i->transport+$i->commission);
//         $totalProfit = $totalSales - $totalCost;

//         return response()->json([
//             'sales' => round($totalSales,2),
//             'cost'  => round($totalCost,2),
//             'profit'=> round($totalProfit,2),
//             'profit_percent'=> $totalSales>0 ? round(($totalProfit/$totalSales)*100,2) : 0
//         ]);
//     }

//     // =========================
//     // Shared Calculation
//     // =========================
//     private function calculateGroup($group, $extra = [])
//     {
//         $sales = $group->sum('amount');
//         $cost  = $group->sum(fn($i) => ($i->qty*$i->price)+$i->transport+$i->commission);
//         $profit = $sales - $cost;

//         return array_merge($extra, [
//             'sales'=> round($sales,2),
//             'cost'=> round($cost,2),
//             'profit_amount'=> round($profit,2),
//             'profit_percent'=> $sales>0 ? round(($profit/$sales)*100,2) : 0
//         ]);
//     }

//     // =========================
//     // Helper: Fetch invoices with price
//     // =========================
//     private function getInvoices(Request $request)
//     {
//         $from = $request->query('from_date');
//         $to   = $request->query('to_date');

//         return DB::table('invoice_records as i')
//                  ->join('product_master as p','i.item','=','p.product_name')
//                  ->select('i.date','i.city','i.salesman','i.invoice_no','i.amount','i.qty','p.price','i.transport','i.commission')
//                  ->when($from && $to, fn($q) => $q->whereBetween('i.date', [$from,$to]))
//                  ->get();
//     }
// }

 

 

class chartcontroller extends Controller
{
    // =========================
    // 1. Date-wise
    // =========================
    public function dateWise(Request $request)
    {
        $from = $request->query('from_date');
        $to   = $request->query('to_date');

        $query = DB::table('invoice_records as i')
            ->leftJoin('product_master as p', DB::raw('TRIM(i.item)'), '=', DB::raw('TRIM(p.product_name)'))
            ->selectRaw("
                DATE(i.date) as date,
                SUM(i.amount) as sales,
                SUM((COALESCE(p.price,0) * i.qty) + COALESCE(i.transport,0) + COALESCE(i.commission,0)) as cost,
                SUM(i.amount) - SUM((COALESCE(p.price,0) * i.qty) + COALESCE(i.transport,0) + COALESCE(i.commission,0)) as profit
            ")
            ->groupBy(DB::raw('DATE(i.date)'))
            ->orderBy('date');

        if ($from && $to) {
            $query->whereBetween('i.date', [$from, $to]);
        }

        $result = $query->get()->map(function ($row) {
            $row->profit_percent = $row->sales > 0
                ? round(($row->profit / $row->sales) * 100, 2)
                : 0;
            return $row;
        });

        return response()->json($result);
    }

    // =========================
    // 2. City-wise
    // =========================
    public function cityWise(Request $request)
    {
        $from = $request->query('from_date');
        $to   = $request->query('to_date');

        $query = DB::table('invoice_records as i')
            ->leftJoin('product_master as p', DB::raw('TRIM(i.item)'), '=', DB::raw('TRIM(p.product_name)'))
            ->selectRaw("
                i.city,
                SUM(i.amount) as sales,
                SUM((COALESCE(p.price,0) * i.qty) + COALESCE(i.transport,0) + COALESCE(i.commission,0)) as cost,
                SUM(i.amount) - SUM((COALESCE(p.price,0) * i.qty) + COALESCE(i.transport,0) + COALESCE(i.commission,0)) as profit
            ")
            ->groupBy('i.city')
            ->orderByDesc('sales');

        if ($from && $to) {
            $query->whereBetween('i.date', [$from, $to]);
        }

        $result = $query->get()->map(function ($row) {
            $row->profit_percent = $row->sales > 0
                ? round(($row->profit / $row->sales) * 100, 2)
                : 0;
            return $row;
        });

        return response()->json($result);
    }

    // =========================
    // 3. Salesman-wise
    // =========================
    public function salesmanWise(Request $request)
    {
        $from = $request->query('from_date');
        $to   = $request->query('to_date');

        $query = DB::table('invoice_records as i')
            ->leftJoin('product_master as p', DB::raw('TRIM(i.item)'), '=', DB::raw('TRIM(p.product_name)'))
            ->selectRaw("
                i.salesman,
                SUM(i.amount) as sales,
                SUM((COALESCE(p.price,0) * i.qty) + COALESCE(i.transport,0) + COALESCE(i.commission,0)) as cost,
                SUM(i.amount) - SUM((COALESCE(p.price,0) * i.qty) + COALESCE(i.transport,0) + COALESCE(i.commission,0)) as profit
            ")
            ->groupBy('i.salesman')
            ->orderByDesc('sales');

        if ($from && $to) {
            $query->whereBetween('i.date', [$from, $to]);
        }

        $result = $query->get()->map(function ($row) {
            $row->profit_percent = $row->sales > 0
                ? round(($row->profit / $row->sales) * 100, 2)
                : 0;
            return $row;
        });

        return response()->json($result);
    }

    // =========================
    // 4. Drilldown: City → Salesmen
    // =========================
    public function salesmenInCity(Request $request)
    {
        $city = $request->query('city');

        $query = DB::table('invoice_records as i')
            ->leftJoin('product_master as p', DB::raw('TRIM(i.item)'), '=', DB::raw('TRIM(p.product_name)'))
            ->where('i.city', $city)
            ->selectRaw("
                i.salesman,
                SUM(i.amount) as sales,
                SUM((COALESCE(p.price,0) * i.qty) + COALESCE(i.transport,0) + COALESCE(i.commission,0)) as cost,
                SUM(i.amount) - SUM((COALESCE(p.price,0) * i.qty) + COALESCE(i.transport,0) + COALESCE(i.commission,0)) as profit
            ")
            ->groupBy('i.salesman')
            ->orderByDesc('sales');

        $result = $query->get()->map(function ($row) {
            $row->profit_percent = $row->sales > 0
                ? round(($row->profit / $row->sales) * 100, 2)
                : 0;
            return $row;
        });

        return response()->json($result);
    }

    // =========================
    // 5. Drilldown: City → Salesman → Date
    // =========================
    public function salesmanDates(Request $request)
    {
        $city = $request->query('city');
        $salesman = $request->query('salesman');

        $query = DB::table('invoice_records as i')
            ->leftJoin('product_master as p', DB::raw('TRIM(i.item)'), '=', DB::raw('TRIM(p.product_name)'))
            ->where('i.city', $city)
            ->where('i.salesman', $salesman)
            ->selectRaw("
                DATE(i.date) as date,
                SUM(i.amount) as sales,
                SUM((COALESCE(p.price,0) * i.qty) + COALESCE(i.transport,0) + COALESCE(i.commission,0)) as cost,
                SUM(i.amount) - SUM((COALESCE(p.price,0) * i.qty) + COALESCE(i.transport,0) + COALESCE(i.commission,0)) as profit
            ")
            ->groupBy(DB::raw('DATE(i.date)'))
            ->orderBy('date');

        $result = $query->get()->map(function ($row) {
            $row->profit_percent = $row->sales > 0
                ? round(($row->profit / $row->sales) * 100, 2)
                : 0;
            return $row;
        });

        return response()->json($result);
    }

    // =========================
    // 6. Drilldown: Salesman → Cities
    // =========================
    public function salesmanInCities(Request $request)
    {
        $salesman = $request->query('salesman');

        $query = DB::table('invoice_records as i')
            ->leftJoin('product_master as p', DB::raw('TRIM(i.item)'), '=', DB::raw('TRIM(p.product_name)'))
            ->where('i.salesman', $salesman)
            ->selectRaw("
                i.city,
                SUM(i.amount) as sales,
                SUM((COALESCE(p.price,0) * i.qty) + COALESCE(i.transport,0) + COALESCE(i.commission,0)) as cost,
                SUM(i.amount) - SUM((COALESCE(p.price,0) * i.qty) + COALESCE(i.transport,0) + COALESCE(i.commission,0)) as profit
            ")
            ->groupBy('i.city')
            ->orderByDesc('sales');

        $result = $query->get()->map(function ($row) {
            $row->profit_percent = $row->sales > 0
                ? round(($row->profit / $row->sales) * 100, 2)
                : 0;
            return $row;
        });

        return response()->json($result);
    }

    // =========================
    // Totals
    // =========================
    public function totals(Request $request)
    {
        $from = $request->query('from_date');
        $to   = $request->query('to_date');

        $query = DB::table('invoice_records as i')
            ->leftJoin('product_master as p', DB::raw('TRIM(i.item)'), '=', DB::raw('TRIM(p.product_name)'))
            ->selectRaw("
                SUM(i.amount) as sales,
                SUM((COALESCE(p.price,0) * i.qty) + COALESCE(i.transport,0) + COALESCE(i.commission,0)) as cost,
                SUM(i.amount) - SUM((COALESCE(p.price,0) * i.qty) + COALESCE(i.transport,0) + COALESCE(i.commission,0)) as profit
            ");

        if ($from && $to) {
            $query->whereBetween('i.date', [$from, $to]);
        }

        $row = $query->first();

        $sales  = $row->sales ?? 0;
        $cost   = $row->cost ?? 0;
        $profit = $row->profit ?? 0;

        return response()->json([
            'sales' => round($sales, 2),
            'cost' => round($cost, 2),
            'profit' => round($profit, 2),
            'profit_percent' => $sales > 0 ? round(($profit / $sales) * 100, 2) : 0,
        ]);
    }
}


// SELECT
//     i.date,
//     SUM(i.amount) AS total_sales,
//     SUM((p.price * i.qty) + COALESCE(i.transport, 0) + COALESCE(i.commission, 0)) AS total_cost,
//     SUM(i.amount) - SUM((p.price * i.qty) + COALESCE(i.transport, 0) + COALESCE(i.commission, 0)) AS total_profit
// FROM
//     invoice_records AS i
// LEFT JOIN
//     product_master AS p ON TRIM(i.item) = TRIM(p.product_name)
// GROUP BY
//     i.date
// ORDER BY
//     i.date;