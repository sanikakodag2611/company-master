import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Text,
} from "recharts";
import axios from "axios";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

export default function ProfitLineChart() {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lineType, setLineType] = useState("monotone"); // monotone, linear, step

  const fetchChartData = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates.");
      return;
    }

    try {
      setLoading(true);
      const apiFrom = format(fromDate, "yyyy-MM-dd");
      const apiTo = format(toDate, "yyyy-MM-dd");

      const res = await axios.get(
        `http://127.0.0.1:8000/api/profit-chart?from_date=${apiFrom}&to_date=${apiTo}`
      );

      if (!res.data || res.data.length === 0) {
        setData([]);
      } else {
        // convert to proper numeric values
        const formattedData = res.data.map((item) => ({
          date: format(new Date(item.date), "dd-MM-yyyy"),
          revenue: Number(item.revenue),
          profit: Number(item.profit),
          cost: Number(item.cost),
          profit_rate: Number(item.profit_rate),
        }));
        setData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const renderNoData = () => (
    <Text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
      style={{ fontSize: 18, fill: "#888" }}
    >
      No Data Found
    </Text>
  );

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <h2>Profit Analysis Line Chart</h2>

      {/* Date Pickers */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
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

        <button onClick={fetchChartData}>Fetch Chart</button>

        {/* Line Type Selector */}
        <select value={lineType} onChange={(e) => setLineType(e.target.value)}>
          <option value="monotone">Monotone</option>
          <option value="linear">Linear</option>
          <option value="step">Step</option>
        </select>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 400, marginTop: 20 }}>
        {loading ? (
          <p style={{ textAlign: "center", marginTop: "180px" }}>Loading chart...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />

              {data.length > 0 ? (
                <>
                  <Line type={lineType} dataKey="revenue" stroke="#8884d8" name="Revenue" />
                  <Line type={lineType} dataKey="profit" stroke="#82ca9d" name="Profit" />
                  <Line type={lineType} dataKey="cost" stroke="#ffc658" name="Cost" />
                  <Line type={lineType} dataKey="profit_rate" stroke="#ff7300" name="Profit Rate (%)" />
                </>
              ) : (
                renderNoData()
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
