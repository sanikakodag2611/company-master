import React, { useState } from "react";
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
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);

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

      if (res.data.length === 0) {
        setData([]);
      } else {
        const formattedData = res.data.map((item) => ({
          ...item,
          date: format(new Date(item.date), "dd-MM-yyyy"),
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

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <h2>Profit Analysis Chart</h2>
<div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
  <div style={{ position: "relative" }}>
    <label>From Date: </label>
    <DatePicker
      selected={fromDate}
      onChange={(date) => {
        setFromDate(date);
        if (toDate && date > toDate) {
          setToDate(null); // reset To Date if it's before From Date
        }
      }}
      dateFormat="dd-MM-yyyy"
      placeholderText="DD-MM-YYYY"
      popperPlacement="bottom-start"
      withPortal={false}
      popperModifiers={[{ name: "flip", enabled: false }]}
    />
  </div>

  <div style={{ position: "relative" }}>
    <label>To Date: </label>
    <DatePicker
      selected={toDate}
      onChange={(date) => setToDate(date)}
      dateFormat="dd-MM-yyyy"
      placeholderText="DD-MM-YYYY"
      popperPlacement="bottom-start"
      withPortal={false}
      popperModifiers={[{ name: "flip", enabled: false }]}
      minDate={fromDate} // ensures To Date cannot be earlier than From Date
    />
  </div>

  <button onClick={fetchChartData}>Fetch Chart</button>
</div>


      <div style={{ width: "100%", height: 400 }}>
        {loading ? (
          <p>Loading chart...</p>
        ) : data.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "180px", fontSize: "18px", color: "#888" }}>
            No Data Found
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
              <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
              <Bar dataKey="cost" fill="#ffc658" name="Cost" />
              <Bar dataKey="profit_rate" fill="#ff7300" name="Profit Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
