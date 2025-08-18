import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
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

export default function ProfitLineChart() {
  const today = new Date();
  const firstDate = new Date(today.getFullYear(), today.getMonth(), 1);

  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState(firstDate);
  const [toDate, setToDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [lineType, setLineType] = useState("monotone");

  // Filters
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salesmen, setSalesmen] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedSalesman, setSelectedSalesman] = useState("");

  // Fetch chart + filters together
  const fetchChartData = async () => {
    if (!fromDate || !toDate) return;
    try {
      setLoading(true);
      const apiFrom = format(fromDate, "yyyy-MM-dd");
      const apiTo = format(toDate, "yyyy-MM-dd");

      const res = await axios.get("http://127.0.0.1:8000/api/profit-report-raw", {
        params: {
          from_date: apiFrom,
          to_date: apiTo,
          product_name: selectedProduct || undefined,
          customer_name: selectedCustomer || undefined,
          salesman_name: selectedSalesman || undefined,
        },
      });

      const { data: chartData, filters } = res.data;

      // Set dropdown options
      setProducts(filters.products || []);
      setCustomers(filters.customers || []);
      setSalesmen(filters.salesmen || []);

      // Format chart data
      const formattedData = (chartData || []).map((item) => ({
        rawDate: item.date ? new Date(item.date) : null,
        date: item.date ? format(new Date(item.date), "dd-MM-yyyy") : "Overall",
        sales: Number(item.sales),
        cost: Number(item.cost),
        profit: Number(item.profit_amount),
        profit_on_sale: Number(item.profit_percent),
        profit_on_basic: Number(item.profit_percent_on_basic),
      }));

      setData(formattedData.sort((a, b) => (a.rawDate || 0) - (b.rawDate || 0)));
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [fromDate, toDate, selectedProduct, selectedCustomer, selectedSalesman]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;

      return (
        <div style={{ background: "#fff", padding: 10, border: "1px solid #ccc", borderRadius: 5 }}>
          <p><b>{label}</b></p>
          {payload.map((entry, index) => {
            let extra = "";
            if (entry.name === "Cost" && dataPoint.profit_on_basic !== undefined) {
              extra = ` (Profit on Basic: ${dataPoint.profit_on_basic}%)`;
            } else if (entry.name === "Sales" && dataPoint.profit_on_sale !== undefined) {
              extra = ` (Profit on Sale: ${dataPoint.profit_on_sale}%)`;
            }

            return (
              <p key={index} style={{ color: entry.stroke }}>
                {entry.name}: ₹{entry.value.toLocaleString()}{extra}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Construct no-data message based on applied filters
  const noDataMessageLine = [
    selectedProduct && `product "${selectedProduct}"`,
    selectedCustomer && `customer "${selectedCustomer}"`,
    selectedSalesman && `salesman "${selectedSalesman}"`,
  ].filter(Boolean).join(", ");

  return (
    <div style={{ width: "100%", padding: 20 }}>
      <h2>Profit Analysis Line Chart</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div>
          <label>From Date: </label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => { setFromDate(date); if (toDate && date && date > toDate) setToDate(null); }}
            dateFormat="dd-MM-yyyy"
          />
        </div>
        <div>
          <label>To Date: </label>
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            dateFormat="dd-MM-yyyy"
            minDate={fromDate}
          />
        </div>

        <div>
          <label>Product: </label>
          <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
            <option value="">All</option>
            {products.map((p, i) => <option key={i} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label>Customer: </label>
          <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
            <option value="">All</option>
            {customers.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label>Salesman: </label>
          <select value={selectedSalesman} onChange={(e) => setSelectedSalesman(e.target.value)}>
            <option value="">All</option>
            {salesmen.map((s, i) => <option key={i} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label>Line Type: </label>
          <select value={lineType} onChange={(e) => setLineType(e.target.value)}>
            <option value="monotone">Monotone</option>
            <option value="linear">Linear</option>
            <option value="step">Step</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 400, marginTop: 20 }}>
        {loading ? (
          <p style={{ textAlign: "center", marginTop: 180 }}>Loading chart...</p>
        ) : data.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: 180, color: "#888", fontSize: 18 }}>
            No data found{noDataMessageLine ? ` for ${noDataMessageLine}` : ""}.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" domain={[0, "auto"]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line yAxisId="left" type={lineType} dataKey="sales" stroke="#8884d8" name="Sales" />
              <Line yAxisId="left" type={lineType} dataKey="cost" stroke="#ffc658" name="Cost" />
              <Line yAxisId="left" type={lineType} dataKey="profit" stroke="#82ca9d" name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
