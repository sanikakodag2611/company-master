import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

export default function ProfitChart() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState("all");
  const [productsList, setProductsList] = useState([]);

  const [customer, setCustomer] = useState("all");
  const [customerList, setCustomerList] = useState([]);

  const [salesman, setSalesman] = useState("all");
  const [salesmanList, setSalesmanList] = useState([]);

  const [chartData, setChartData] = useState([]);
  const [ setIsOverall] = useState(false);

  // --- Initial load: first day of month to today
  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    setFromDate(firstDayOfMonth);
    setToDate(today);

    fetchChartData(firstDayOfMonth, today, product, customer, salesman);
  }, []);

  // --- Fetch chart when filters or dates change
  useEffect(() => {
    if (fromDate && toDate) {
      fetchChartData(fromDate, toDate, product, customer, salesman);
    }
  }, [fromDate, toDate, product, customer, salesman]);

  const fetchChartData = async (
    from = fromDate,
    to = toDate,
    productFilter = product,
    customerFilter = customer,
    salesmanFilter = salesman
  ) => {
    try {
      setLoading(true);

      const res = await axios.get("http://127.0.0.1:8000/api/profit-chart", {
        params: {
          from_date: from ? format(from, "yyyy-MM-dd") : "",
          to_date: to ? format(to, "yyyy-MM-dd") : "",
          product_name: productFilter === "all" ? "" : productFilter,
          customer_name: customerFilter === "all" ? "" : customerFilter,
          salesman_name: salesmanFilter === "all" ? "" : salesmanFilter,
        },
      });

      // Update dropdowns dynamically
      setProductsList(res.data.filters.products || []);
      setCustomerList(res.data.filters.customers || []);
      setSalesmanList(res.data.filters.salesmen || []);

      const data = res.data.data || [];
      if (data.length === 0) {
        setChartData([]);
        setIsOverall(false);
        return;
      }

      // Determine if overall chart
      const overall = data.length === 1 && !data[0].date;
      setIsOverall(overall);

      if (overall) {
        setChartData([
          {
            name: "Overall",
            sales: data[0].sales,
            cost: data[0].cost,
            profit_amount: data[0].profit_amount,
            profit_percent: data[0].profit_percent,
            profit_percent_on_basic: data[0].profit_percent_on_basic,
          },
        ]);
      } else {
        const formatted = data.map((item) => ({
          ...item,
          name: format(new Date(item.date), "dd-MM-yyyy"),
        }));
        setChartData(formatted);
      }
    } catch (err) {
      console.error("Error fetching chart data:", err);
      setChartData([]);
      setIsOverall(false);
    } finally {
      setLoading(false);
    }
  };

  const noDataMessage = [
    product !== "all" && `product "${product}"`,
    customer !== "all" && `customer "${customer}"`,
    salesman !== "all" && `salesman "${salesman}"`,
  ].filter(Boolean).join(", ");

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <h2>Profit Analysis Chart</h2>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
        <div>
          <label>From Date: </label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => {
              setFromDate(date);
              if (toDate && date > toDate) setToDate(null);
            }}
            dateFormat="dd-MM-yyyy"
            placeholderText="DD-MM-YYYY"
          />
        </div>

        <div>
          <label>To Date: </label>
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            dateFormat="dd-MM-yyyy"
            placeholderText="DD-MM-YYYY"
            minDate={fromDate}
          />
        </div>

        <div>
          <label>Product: </label>
          <select value={product} onChange={(e) => setProduct(e.target.value)}>
            <option value="all">All</option>
            {productsList.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Customer: </label>
          <select value={customer} onChange={(e) => setCustomer(e.target.value)}>
            <option value="all">All</option>
            {customerList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Salesman: </label>
          <select value={salesman} onChange={(e) => setSalesman(e.target.value)}>
            <option value="all">All</option>
            {salesmanList.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 400, marginTop: "20px" }}>
        {loading ? (
          <p>Loading chart...</p>
        ) : chartData.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "180px", fontSize: "18px", color: "#888" }}>
            No data found{noDataMessage ? ` for ${noDataMessage}` : ""}.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name="Sales" />
              <Bar dataKey="cost" fill="#ffc658" name="Cost" />
              <Bar dataKey="profit_amount" fill="#82ca9d" name="Profit" />
              <Bar dataKey="profit_percent" fill="#ff7300" name="Profit % on Sales" />
              <Bar dataKey="profit_percent_on_basic" fill="#00bcd4" name="Profit % on Basic" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
