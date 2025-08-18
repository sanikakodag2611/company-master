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
  LabelList,
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
  const [hoveredBar, setHoveredBar] = useState(null);  

  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    setFromDate(firstDayOfMonth);
    setToDate(today);
    fetchChartData(firstDayOfMonth, today, product, customer, salesman);
  }, []);

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

      setProductsList(res.data.filters.products || []);
      setCustomerList(res.data.filters.customers || []);
      setSalesmanList(res.data.filters.salesmen || []);

      const data = res.data.data || [];
      if (data.length === 0) {
        setChartData([]);
        setIsOverall(false);
        return;
      }

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

  const renderTooltipContent = (payload, label) => {
    if (!payload || !payload.length || !hoveredBar) return null;
    const data = payload[0].payload;

    let content;
    switch (hoveredBar) {
      case "sales":
        content = (
          <>
            Sales: {data.sales}
            <br />
            Profit % on Sales: {data.profit_percent}%
          </>
        );
        break;
      case "cost":
        content = (
          <>
            Cost: {data.cost}
            <br />
            Profit % on Basic: {data.profit_percent_on_basic}%
          </>
        );
        break;
      case "profit_amount":
        content = <>Profit Amount: {data.profit_amount}</>;
        break;
      case "profit_percent":
        content = <>Profit % on Sales: {data.profit_percent}%</>;
        break;
      case "profit_percent_on_basic":
        content = <>Profit % on Basic: {data.profit_percent_on_basic}%</>;
        break;
      default:
        content = null;
    }

    return (
      <div style={{ background: "#fff", border: "1px solid #ccc", padding: "8px" }}>
        <strong>{label}</strong>
        <br />
        {content}
      </div>
    );
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
              <Tooltip
                cursor={{ fill: 'rgba(0,0,0,0.1)' }}
                content={({ payload, label }) => renderTooltipContent(payload, label)}
              />
              <Legend />



              <Bar
                dataKey="sales"
                stackId="b"
                fill="#8884d8"
                name="Sales"
                onMouseOver={() => setHoveredBar("sales")}
                onMouseOut={() => setHoveredBar(null)}
              >
                
              </Bar>

              <Bar
                dataKey="cost"
                stackId="a"
                fill="#ffc658"
                name="Cost"
                onMouseOver={() => setHoveredBar("cost")}
                onMouseOut={() => setHoveredBar(null)}
              >
                
              </Bar>

              <Bar
                dataKey="profit_amount"
                fill="#82ca9d"
                name="Profit"
                onMouseOver={() => setHoveredBar("profit_amount")}
                onMouseOut={() => setHoveredBar(null)}
              >
               
              </Bar>
{/* 
              <Bar
                dataKey="profit_percent"
                stackId="b"
                name="Profit % on Sales"
                onMouseOver={() => setHoveredBar("profit_percent")}
                onMouseOut={() => setHoveredBar(null)}
              >
                </Bar>

              <Bar
                dataKey="profit_percent_on_basic"
                stackId="a"
                 
                name="Profit % on Basic"
                onMouseOver={() => setHoveredBar("profit_percent_on_basic")}
                onMouseOut={() => setHoveredBar(null)}
              > */}
               {/* </Bar> */}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
