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
  const [isOverall, setIsOverall] = useState(false);

  // Fetch products
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products")
      .then(res => setProductsList(res.data.data || []))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  // Fetch customers
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/customers")
      .then(res => setCustomerList(res.data.data || []))
      .catch(err => console.error("Error fetching customers:", err));
  }, []);

  // Fetch salesmen
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/salesmans")
      .then(res => setSalesmanList(res.data.data || []))
      .catch(err => console.error("Error fetching salesmen:", err));
  }, []);

  // Fetch chart data
  useEffect(() => {
    if (fromDate && toDate) fetchChartData();
  }, [fromDate, toDate, product, customer, salesman]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const apiFrom = format(fromDate, "yyyy-MM-dd");
      const apiTo = format(toDate, "yyyy-MM-dd");

      const res = await axios.get("http://127.0.0.1:8000/api/profit-chart", {
        params: {
          from_date: apiFrom,
          to_date: apiTo,
          product_name: product === "all" ? "" : product,
          customer_name: customer === "all" ? "" : customer,
          salesman_name: salesman === "all" ? "" : salesman,
        },
      });

      if (!res.data || res.data.length === 0) {
        setChartData([]);
        setIsOverall(false);
        return;
      }

      const overall = !res.data[0].date;
      setIsOverall(overall);

      if (overall) {
        // For overall, convert single object into array of bars
        setChartData([
          { name: "Revenue", value: res.data[0].revenue },
          { name: "Cost", value: res.data[0].cost },
          { name: "Profit", value: res.data[0].profit },
          { name: "Profit Rate (%)", value: res.data[0].profit_rate },
        ]);
      } else {
        // For date-wise, format each row
        const formatted = res.data.map(item => ({
          ...item,
          date: format(new Date(item.date), "dd-MM-yyyy"),
        }));
        setChartData(formatted);
      }

    } catch (error) {
      console.error("Error fetching chart data:", error);
      setChartData([]);
      setIsOverall(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <h2>Profit Analysis Chart</h2>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
        <div>
          <label>From Date: </label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => { setFromDate(date); if (toDate && date > toDate) setToDate(null); }}
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
            {productsList.map(p => <option key={p.id} value={p.product_name}>{p.product_name}</option>)}
          </select>
        </div>

        <div>
          <label>Customer: </label>
          <select value={customer} onChange={(e) => setCustomer(e.target.value)}>
            <option value="all">All</option>
            {customerList.map(c => <option key={c.customer_name} value={c.customer_name}>{c.customer_name}</option>)}
          </select>
        </div>

        <div>
          <label>Salesman: </label>
          <select value={salesman} onChange={(e) => setSalesman(e.target.value)}>
            <option value="all">All</option>
            {salesmanList.map(s => <option key={s.salesman_name} value={s.salesman_name}>{s.salesman_name}</option>)}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 400, marginTop: "20px" }}>
        {loading ? (
          <p>Loading chart...</p>
        ) : chartData.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "180px", fontSize: "18px", color: "#888" }}>
            {`No data found for ${product !== "all" ? `product "${product}"` : ""} ${
              customer !== "all" ? `and customer "${customer}"` : ""
            }${salesman !== "all" ? `and salesman "${salesman}"` : ""}`}
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={isOverall ? chartData : chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={isOverall ? "name" : "date"} />
              <YAxis />
              <Tooltip />
              <Legend />
              {isOverall ? (
                <>
                  <Bar dataKey="value" fill="#8884d8" />
                </>
              ) : (
                <>
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                  <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
                  <Bar dataKey="cost" fill="#ffc658" name="Cost" />
                  <Bar dataKey="profit_rate" fill="#ff7300" name="Profit Rate (%)" />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
