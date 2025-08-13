import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Text } from "recharts";
import axios from "axios";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

export default function ProfitPieChart() {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"]; // Cost, Profit, Revenue, Profit Rate

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
        // Sum totals for each field
        let totalRevenue = 0,
          totalProfit = 0,
          totalCost = 0;

        res.data.forEach((item) => {
          totalRevenue += Number(item.revenue);
          totalProfit += Number(item.profit);
          totalCost += Number(item.cost);
        });

        setData([
          { name: "Revenue", value: totalRevenue },
          { name: "Profit", value: totalProfit },
          { name: "Cost", value: totalCost },
        ]);
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
      <h2>Profit Analysis Pie Chart</h2>

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
      </div>

      {/* Pie Chart */}
      <div style={{ width: "100%", height: 400, marginTop: 20 }}>
        {loading ? (
          <p style={{ textAlign: "center", marginTop: "180px" }}>Loading chart...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {data.length > 0 ? (
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              renderNoData()
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}


// import React, { useState } from "react";
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import { format } from "date-fns";
// import "react-datepicker/dist/react-datepicker.css";

// export default function ProfitPieChart() {
//   const [data, setData] = useState([]);
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const COLORS = ["#ff7300", "#ffc658", "#82ca9d", "#8884d8"]; // Profit Rate, Cost, Profit, Revenue

//   const fetchChartData = async () => {
//     if (!fromDate || !toDate) {
//       alert("Please select both From and To dates.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const apiFrom = format(fromDate, "yyyy-MM-dd");
//       const apiTo = format(toDate, "yyyy-MM-dd");

//       const res = await axios.get(
//         `http://127.0.0.1:8000/api/profit-chart?from_date=${apiFrom}&to_date=${apiTo}`
//       );

//       if (!res.data || res.data.length === 0) {
//         setData([]);
//       } else {
//         let totalRevenue = 0,
//           totalProfit = 0,
//           totalCost = 0,
//           totalProfitRate = 0;

//         res.data.forEach((item) => {
//           totalRevenue += Number(item.revenue);
//           totalProfit += Number(item.profit);
//           totalCost += Number(item.cost);
//           totalProfitRate += Number(item.profit_rate);
//         });

//         setData([
//           { name: "Profit Rate (%)", value: totalProfitRate },
//           { name: "Cost", value: totalCost },
//           { name: "Profit", value: totalProfit },
//           { name: "Revenue", value: totalRevenue },
//         ]);
//       }
//     } catch (error) {
//       console.error("Error fetching chart data:", error);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ width: "100%", padding: "20px" }}>
//       <h2>Profit Analysis Pie Chart</h2>

//       {/* Date Pickers */}
//       <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
//         <div>
//           <label>From Date: </label>
//           <DatePicker
//             selected={fromDate}
//             onChange={(date) => {
//               setFromDate(date);
//               if (toDate && date > toDate) setToDate(null);
//             }}
//             dateFormat="dd-MM-yyyy"
//             placeholderText="DD-MM-YYYY"
//           />
//         </div>

//         <div>
//           <label>To Date: </label>
//           <DatePicker
//             selected={toDate}
//             onChange={(date) => setToDate(date)}
//             dateFormat="dd-MM-yyyy"
//             placeholderText="DD-MM-YYYY"
//             minDate={fromDate}
//           />
//         </div>

//         <button onClick={fetchChartData}>Fetch Chart</button>
//       </div>

//       {/* Pie Chart */}
//       <div style={{ width: "100%", height: 400, marginTop: 20 }}>
//         {loading ? (
//           <p style={{ textAlign: "center", marginTop: "180px" }}>Loading chart...</p>
//         ) : data.length === 0 ? (
//           <p style={{ textAlign: "center", marginTop: "180px", color: "#888" }}>No Data Found</p>
//         ) : (
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={data}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={120}
//                 label={({ name, value, percent }) =>
//                   `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
//                 }
//               >
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
//               <Legend
//                 layout="vertical"
//                 verticalAlign="middle"
//                 align="right"
//                 formatter={(value) => <span style={{ color: "#555" }}>{value}</span>}
//               />
//             </PieChart>
//           </ResponsiveContainer>
//         )}
//       </div>
//     </div>
//   );
// }


// import React, { useState } from "react";
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import { format } from "date-fns";
// import "react-datepicker/dist/react-datepicker.css";

// export default function ProfitPieChart() {
//   const [data, setData] = useState([]);
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const COLORS = ["#ff7300", "#ffc658", "#82ca9d", "#8884d8"]; // Profit Rate, Cost, Profit, Revenue

//   const fetchChartData = async () => {
//     if (!fromDate || !toDate) {
//       alert("Please select both From and To dates.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const apiFrom = format(fromDate, "yyyy-MM-dd");
//       const apiTo = format(toDate, "yyyy-MM-dd");

//       const res = await axios.get(
//         `http://127.0.0.1:8000/api/profit-chart?from_date=${apiFrom}&to_date=${apiTo}`
//       );

//       if (!res.data || res.data.length === 0) {
//         setData([]);
//       } else {
//         let totalRevenue = 0,
//           totalProfit = 0,
//           totalCost = 0,
//           totalProfitRate = 0;

//         res.data.forEach((item) => {
//           totalRevenue += Number(item.revenue);
//           totalProfit += Number(item.profit);
//           totalCost += Number(item.cost);
//           totalProfitRate += Number(item.profit_rate);
//         });

//         setData([
//           { name: "Profit Rate (%)", value: totalProfitRate },
//           { name: "Cost", value: totalCost },
//           { name: "Profit", value: totalProfit },
//           { name: "Revenue", value: totalRevenue },
//         ]);
//       }
//     } catch (error) {
//       console.error("Error fetching chart data:", error);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ width: "100%", padding: "20px" }}>
//       <h2>Profit Analysis Pie Chart</h2>

//       {/* Date Pickers */}
//       <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
//         <div>
//           <label>From Date: </label>
//           <DatePicker
//             selected={fromDate}
//             onChange={(date) => {
//               setFromDate(date);
//               if (toDate && date > toDate) setToDate(null);
//             }}
//             dateFormat="dd-MM-yyyy"
//             placeholderText="DD-MM-YYYY"
//           />
//         </div>

//         <div>
//           <label>To Date: </label>
//           <DatePicker
//             selected={toDate}
//             onChange={(date) => setToDate(date)}
//             dateFormat="dd-MM-yyyy"
//             placeholderText="DD-MM-YYYY"
//             minDate={fromDate}
//           />
//         </div>

//         <button onClick={fetchChartData}>Fetch Chart</button>
//       </div>

//       {/* Pie Chart */}
//       <div style={{ width: "100%", height: 400, marginTop: 20 }}>
//         {loading ? (
//           <p style={{ textAlign: "center", marginTop: "180px" }}>Loading chart...</p>
//         ) : data.length === 0 ? (
//           <p style={{ textAlign: "center", marginTop: "180px", color: "#888" }}>No Data Found</p>
//         ) : (
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={data}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={130}
//                 label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
//               >
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
//               <Legend
//                 layout="vertical"
//                 verticalAlign="middle"
//                 align="right"
//                 iconType="circle"
//               />
//             </PieChart>
//           </ResponsiveContainer>
//         )}
//       </div>
//     </div>
//   );
// }
