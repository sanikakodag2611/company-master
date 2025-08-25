import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

export default function ProfitPieChartApex() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({ series: [], labels: [] });
  const [totals, setTotals] = useState({ sales: 0, profit: 0 });

  const [groupBySalesman, setGroupBySalesman] = useState(false);
  const [groupByCity, setGroupByCity] = useState(false);
  const [drillDownCity, setDrillDownCity] = useState(null);
  const [drillDownSalesman, setDrillDownSalesman] = useState(null);

  const [activeToggles, setActiveToggles] = useState({ Sales: true, Profit: true });

  // Default date range: first day of month → today
  useEffect(() => {
    const today = new Date();
    setFromDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setToDate(today);
  }, []);

  // Fetch data whenever filters/toggles change
  useEffect(() => {
    if (fromDate && toDate) {
      fetchChartData();
      fetchTotals();
    }
    // eslint-disable-next-line
  }, [fromDate, toDate, groupBySalesman, groupByCity, drillDownCity, drillDownSalesman, activeToggles]);

  const fetchChartData = async () => {
    try {
      setLoading(true);

      const params = {
        from_date: format(fromDate, "yyyy-MM-dd"),
        to_date: format(toDate, "yyyy-MM-dd"),
      };

      let endpoint = "/api/date-wise";
      if (drillDownCity && groupByCity) {
        endpoint = "/api/salesmen-in-city";
        params.city = drillDownCity;
      } else if (drillDownSalesman && groupBySalesman) {
        endpoint = "/api/salesman-in-cities";
        params.salesman = drillDownSalesman;
      } else if (groupByCity) endpoint = "/api/city-wise";
      else if (groupBySalesman) endpoint = "/api/salesman-wise";

      const res = await axios.get(`http://127.0.0.1:8000${endpoint}`, { params });
      const data = res.data || [];

      if (!data.length) {
        setChartData({ series: [], labels: [] });
        return;
      }

      // Build categories
      let categories = [];
      if (drillDownCity && groupByCity) categories = [...new Set(data.map(d => d.salesman))];
      else if (drillDownSalesman && groupBySalesman) categories = [...new Set(data.map(d => d.city))];
      else if (groupByCity) categories = [...new Set(data.map(d => d.city))];
      else if (groupBySalesman) categories = [...new Set(data.map(d => d.salesman))];
      else categories = [...new Set(data.map(d => d.date))];

      const series = [];
      const labels = [];

      // Construct series and labels properly
      categories.forEach(cat => {
        const rows = data.filter(d => d.city === cat || d.salesman === cat || d.date === cat);

        if (activeToggles.Sales) {
          const val = rows.reduce((sum, r) => sum + (r.sales ?? 0), 0);
          if (val > 0) {
            series.push(val);
            labels.push(`${cat} - Sales`);
          }
        }

        if (activeToggles.Profit) {
          const val = rows.reduce((sum, r) => sum + (r.profit ?? 0), 0);
          if (val > 0) {
            series.push(val);
            labels.push(`${cat} - Profit`);
          }
        }
      });

      setChartData({ series, labels });
    } catch (err) {
      console.error("Chart fetch error:", err);
      setChartData({ series: [], labels: [] });
    } finally {
      setLoading(false);
    }
  };

  const fetchTotals = async () => {
    try {
      const params = {
        from_date: format(fromDate, "yyyy-MM-dd"),
        to_date: format(toDate, "yyyy-MM-dd"),
        toggles: Object.keys(activeToggles).filter(k => activeToggles[k]),
      };
      if (drillDownCity && groupByCity) params.city = drillDownCity;
      if (drillDownSalesman && groupBySalesman) params.salesman = drillDownSalesman;

      const res = await axios.get("http://127.0.0.1:8000/api/totals", { params });
      setTotals(res.data);
    } catch (err) {
      console.error("Totals fetch error:", err);
      setTotals({ sales: 0, profit: 0 });
    }
  };

  const toggleHandler = key => setActiveToggles(prev => ({ ...prev, [key]: !prev[key] }));

  const generateColors = count => Array.from({ length: count }, (_, i) => `hsl(${Math.floor((360 / count) * i)}, 70%, 50%)`);

  const extractNameFromLabel = label => {
    const m = label?.match(/^(.*?)\s-\s(Sales|Profit)$/);
    return m ? m[1] : label;
  };

  const onSliceClick = idx => {
    const clicked = chartData.labels[idx];
    const name = extractNameFromLabel(clicked);
    if (groupByCity && !drillDownCity) setDrillDownCity(name);
    else if (groupBySalesman && !drillDownSalesman) setDrillDownSalesman(name);
  };

  const backFromDrill = () => {
    setDrillDownCity(null);
    setDrillDownSalesman(null);
  };

  const getChartInfoLabel = () => {
    if (drillDownCity && groupByCity) return `Salesman-wise distribution in ${drillDownCity}`;
    if (groupByCity) return "City-wise Sales/Profit distribution";
    if (drillDownSalesman && groupBySalesman) return `City-wise distribution for ${drillDownSalesman}`;
    if (groupBySalesman) return "Salesman-wise Sales/Profit distribution";
    return "Date-wise Sales/Profit distribution";
  };

  return (
    <div style={{ width: "100%", padding: 20 }}>
      <h2>Profit Analysis Pie Chart</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <DatePicker selected={fromDate} onChange={date => { setFromDate(date); if(toDate && date>toDate) setToDate(null); }} dateFormat="dd-MM-yyyy" />
        <DatePicker selected={toDate} onChange={setToDate} dateFormat="dd-MM-yyyy" minDate={fromDate} />

        <button onClick={() => { setGroupBySalesman(!groupBySalesman); if(!groupBySalesman) setGroupByCity(false); backFromDrill(); }}
          style={{ backgroundColor: groupBySalesman?"#1E90FF":"#ccc", color:"#fff", padding:"6px 12px", border:"none", borderRadius:4, cursor:"pointer" }}>Salesman</button>

        <button onClick={() => { setGroupByCity(!groupByCity); if(!groupByCity) setGroupBySalesman(false); backFromDrill(); }}
          style={{ backgroundColor: groupByCity?"#1E90FF":"#ccc", color:"#fff", padding:"6px 12px", border:"none", borderRadius:4, cursor:"pointer" }}>City</button>

        {["Sales","Profit"].map(k => (
          <button key={k} onClick={()=>toggleHandler(k)}
            style={{
              padding:"6px 12px", marginLeft:5,
              backgroundColor: activeToggles[k] ? (k==="Sales"?"#1E90FF":"#32CD32"):"#ccc",
              color:"#fff", border:"none", borderRadius:4, cursor:"pointer"
            }}>{k}</button>
        ))}
      </div>

      {(drillDownCity || drillDownSalesman) && <button style={{marginTop:10}} onClick={backFromDrill}>← Back</button>}

      {/* Totals */}
      <div style={{ marginTop:15, display:"flex", gap:20, fontSize:16, fontWeight:"bold" }}>
        {activeToggles.Sales && <div>Total Sales: ₹{(totals.sales||0).toLocaleString("en-IN")}</div>}
        {activeToggles.Profit && <div>Total Profit: ₹{(totals.profit||0).toLocaleString("en-IN")}</div>}
      </div>

      {/* Chart */}
      <div style={{ width:"100%", height:500, marginTop:20 }}>
        {loading ? <p>Loading chart...</p> :
          chartData.series.length===0 ? <p style={{textAlign:"center", marginTop:180, fontSize:18, color:"#888"}}>No data found.</p> :
          <Chart
            options={{
              chart:{ type:"pie", events:{ dataPointSelection:(e,ctx,config)=> onSliceClick(config.dataPointIndex) }},
              labels: chartData.labels,
              colors: generateColors(chartData.series.length),
              legend:{ position:"right", fontSize:"14px" },
              tooltip:{ y:{ formatter: val=>`₹${Number(val).toLocaleString("en-IN")}` } }
            }}
            series={chartData.series.map(v => Number(v) || 0)}
            type="pie"
            height={500}
          />
        }
      </div>

      <div style={{ textAlign:"center", marginTop:12, fontSize:16, fontWeight:"bold" }}>
        {getChartInfoLabel()}
      </div>
    </div>
  );
}
