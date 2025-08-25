import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

export default function ProfitChartApex() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({ series: [], options: {} });
  const [groupBySalesman, setGroupBySalesman] = useState(false);
  const [groupByCity, setGroupByCity] = useState(false);
  const [drillDownCity, setDrillDownCity] = useState(null);
  const [drillDownSalesman, setDrillDownSalesman] = useState(null);

  // ===============================
  // Set default date range (this month)
  // ===============================
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    setFromDate(firstDay);
    setToDate(today);
  }, []);

  // ===============================
  // Fetch Chart Data
  // ===============================
  useEffect(() => {
    if (fromDate && toDate) fetchChartData();
  }, [fromDate, toDate, groupBySalesman, groupByCity, drillDownCity, drillDownSalesman]);

  const fetchChartData = async () => {
    try {
      setLoading(true);

      const params = {
        from_date: format(fromDate, "yyyy-MM-dd"),
        to_date: format(toDate, "yyyy-MM-dd"),
      };

      let endpoint = "/api/date-wise"; // default

      if (drillDownSalesman && drillDownCity) {
        endpoint = "/api/salesman-dates";
        params.city = drillDownCity;
        params.salesman = drillDownSalesman;
      } else if (drillDownCity && groupByCity) {
        endpoint = "/api/salesmen-in-city";
        params.city = drillDownCity;
      } else if (drillDownSalesman && groupBySalesman) {
        endpoint = "/api/salesman-in-cities";
        params.salesman = drillDownSalesman;
      } else if (groupByCity) {
        endpoint = "/api/city-wise";
      } else if (groupBySalesman) {
        endpoint = "/api/salesman-wise";
      }

      const res = await axios.get(`http://127.0.0.1:8000${endpoint}`, { params });
      const data = res.data || [];

      if (!data.length) {
        setChartData({ series: [], options: {} });
        return;
      }

      // ===============================
      // Build Series + Categories
      // ===============================
      let series = [];
      let categories = [];
      let xAxisLabel = "";

      if (drillDownSalesman && groupBySalesman) {
        // Salesman → Cities
        categories = data.map(d => d.city);
        series = [
          { name: "Sale", data: data.map(d => d.sales - d.profit) },
          { name: "Profit", data: data.map(d => d.profit) },
        ];
        xAxisLabel = `Cities for ${drillDownSalesman}`;

      } else if (drillDownSalesman && drillDownCity) {
        // City → Salesman → Date
        const dateList = [...new Set(data.map(d => d.date))].sort();
        categories = dateList.map(d => format(new Date(d), "dd-MM-yyyy"));
        series = [
          {
            name: "Sale",
            data: dateList.map(d => {
              const sales = data.filter(x => x.date === d).reduce((a, b) => a + b.sales, 0);
              const profit = data.filter(x => x.date === d).reduce((a, b) => a + b.profit, 0);
              return sales - profit;
            }),
          },
          {
            name: "Profit",
            data: dateList.map(d =>
              data.filter(x => x.date === d).reduce((a, b) => a + b.profit, 0)
            ),
          },
        ];
        xAxisLabel = `${drillDownSalesman} in ${drillDownCity} (Date-wise)`;

      } else if (drillDownCity) {
        // City → Salesmen
        categories = data.map(d => d.salesman);
        series = [
          { name: "Sale", data: data.map(d => d.sales - d.profit) },
          { name: "Profit", data: data.map(d => d.profit) },
        ];
        xAxisLabel = `Salesmen in ${drillDownCity}`;

      } else if (groupBySalesman) {
        // Salesman-wise
        categories = data.map(d => d.salesman);
        series = [
          { name: "Sale", data: data.map(d => d.sales - d.profit) },
          { name: "Profit", data: data.map(d => d.profit) },
        ];
        xAxisLabel = "Salesman";

      } else if (groupByCity) {
        // City-wise
        categories = data.map(d => d.city);
        series = [
          { name: "Sale", data: data.map(d => d.sales - d.profit) },
          { name: "Profit", data: data.map(d => d.profit) },
        ];
        xAxisLabel = "City";

      } else {
        // Default: Date-wise
        const dateList = [...new Set(data.map(d => d.date))].sort();
        categories = dateList.map(d => format(new Date(d), "dd-MM-yyyy"));
        series = [
          {
            name: "Sale",
            data: dateList.map(d => {
              const sales = data.filter(x => x.date === d).reduce((a, b) => a + b.sales, 0);
              const profit = data.filter(x => x.date === d).reduce((a, b) => a + b.profit, 0);
              return sales - profit;
            }),
          },
          {
            name: "Profit",
            data: dateList.map(d =>
              data.filter(x => x.date === d).reduce((a, b) => a + b.profit, 0)
            ),
          },
        ];
        xAxisLabel = "Date";
      }

      // ===============================
      // Chart Options
      // ===============================
      setChartData({
        series,
        options: {
          chart: {
            type: "bar",
            stacked:true,
            height: 800,
            events: {
              dataPointSelection: (event, ctx, config) => {
                const clicked = categories[config.dataPointIndex];
                if (groupByCity && !drillDownCity) setDrillDownCity(clicked);
                else if (drillDownCity && !drillDownSalesman) setDrillDownSalesman(clicked);
                else if (groupBySalesman && !drillDownSalesman) setDrillDownSalesman(clicked);
              },
            },
          },
          plotOptions: { bar: { horizontal: false, columnWidth: "70%" } },
          xaxis: {
            categories,
            title: { text: xAxisLabel, style: { fontWeight: 600, fontSize: "14px" } },
          },
          yaxis: {
            title: { text: "Amount (₹)", style: { fontWeight: 600, fontSize: "14px" } },
            labels: {
              formatter: val =>
                `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
            },
          },
          colors: ["#3498db", "#2ecc71"], // Sale Blue, Profit Green
          tooltip: {
            shared: false,
            y: {
              formatter: (val, { seriesIndex, w }) =>
                `${w.globals.seriesNames[seriesIndex]}: ₹${val.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}`,
            },
            legend: { position: "top" },
          },
          dataLabels: {
            enabled: true,
            formatter: val =>
              `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
          },
          legend: { position: "top" },
        },
      });
    } catch (err) {
      console.error(err);
      setChartData({ series: [], options: {} });
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <h2>Profit Analysis Chart</h2>

      {/* Date Filters */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <label>From: </label>
          <DatePicker
            selected={fromDate}
            onChange={date => {
              setFromDate(date);
              if (toDate && date > toDate) setToDate(null);
            }}
            dateFormat="dd-MM-yyyy"
          />
        </div>
        <div>
          <label>To: </label>
          <DatePicker
            selected={toDate}
            onChange={date => setToDate(date)}
            dateFormat="dd-MM-yyyy"
            minDate={fromDate}
          />
        </div>
        <div>
          <label style={{ marginRight: "10px" }}>
            <input
              type="checkbox"
              checked={groupBySalesman}
              onChange={e => {
                setGroupBySalesman(e.target.checked);
                if (e.target.checked) setGroupByCity(false);
                setDrillDownCity(null);
                setDrillDownSalesman(null);
              }}
            />{" "}
            Salesman
          </label>
          <label>
            <input
              type="checkbox"
              checked={groupByCity}
              onChange={e => {
                setGroupByCity(e.target.checked);
                if (e.target.checked) setGroupBySalesman(false);
                setDrillDownCity(null);
                setDrillDownSalesman(null);
              }}
            />{" "}
            City
          </label>
        </div>
      </div>

      {/* Drill-down Back Buttons */}
      <div style={{ marginTop: "10px" }}>
        {drillDownSalesman && groupBySalesman && (
          <button onClick={() => setDrillDownSalesman(null)}>← Back to Salesmen</button>
        )}
        {drillDownCity && (
          <button style={{ marginRight: "10px" }} onClick={() => setDrillDownCity(null)}>
            ← Back to Cities
          </button>
        )}
        {drillDownSalesman && drillDownCity && (
          <button onClick={() => setDrillDownSalesman(null)}>← Back to Salesmen</button>
        )}
      </div>

      {/* Chart */}
      <div style={{ width: "100%", marginTop: "20px" }}>
        {loading ? (
          <p>Loading chart...</p>
        ) : !chartData.series || chartData.series.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: 180, fontSize: "18px", color: "#888" }}>
            No data found for selected range.
          </p>
        ) : (
          <Chart options={chartData.options} series={chartData.series} type="bar" height={400} />
        )}
      </div>
    </div>
  );
}
