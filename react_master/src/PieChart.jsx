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

//   const COLORS = ["#ff7300", "#ffc658", "#82ca9d", "#8884d8"];  

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


// import React, { useState, useEffect } from "react";
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import { format } from "date-fns";
// import "react-datepicker/dist/react-datepicker.css";

// export default function ProfitPieChart() {
//   const today = new Date();
//   const firstDate = new Date(today.getFullYear(), today.getMonth(), 1);

//   const [data, setData] = useState([]);
//   const [fromDate, setFromDate] = useState(firstDate);
//   const [toDate, setToDate] = useState(today);
//   const [loading, setLoading] = useState(false);

//   // Filters
//   const [products, setProducts] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [salesmen, setSalesmen] = useState([]);

//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [selectedCustomer, setSelectedCustomer] = useState("");
//   const [selectedSalesman, setSelectedSalesman] = useState("");

//   const COLORS = ["#ff7300", "#ffc658", "#82ca9d", "#8884d8", "#a4de6c", "#d0ed57"];

//   // Fetch chart data dynamically whenever filters change
//   useEffect(() => {
//     const fetchChartData = async () => {
//       if (!fromDate || !toDate) return;

//       try {
//         setLoading(true);
//         const apiFrom = format(fromDate, "yyyy-MM-dd");
//         const apiTo = format(toDate, "yyyy-MM-dd");

//         const res = await axios.get("http://127.0.0.1:8000/api/profit-report-raw", {
//           params: {
//             from_date: apiFrom,
//             to_date: apiTo,
//             product_name: selectedProduct || undefined,
//             customer_name: selectedCustomer || undefined,
//             salesman_name: selectedSalesman || undefined,
//           },
//         });

//         const { data: chartData, filters } = res.data;

//         // Set dropdown options
//         setProducts(filters.products || []);
//         setCustomers(filters.customers || []);
//         setSalesmen(filters.salesmen || []);

//         if (!chartData || chartData.length === 0) {
//           setData([]);
//         } else {
//           let totalSales = 0,
//               totalCost = 0,
//               totalProfit = 0;

//           chartData.forEach((item) => {
//             totalSales += Number(item.sales);
//             totalCost += Number(item.cost);
//             totalProfit += Number(item.profit_amount);
//           });

//           const profitRate = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

//           setData([
//             { name: "Sales", value: totalSales },
//             { name: "Cost", value: totalCost },
//             { name: "Profit", value: totalProfit },
//             { name: "Profit Rate (%)", value: profitRate },
//           ]);
//         }
//       } catch (error) {
//         console.error("Error fetching chart data:", error);
//         setData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChartData();
//   }, [fromDate, toDate, selectedProduct, selectedCustomer, selectedSalesman]);

//   return (
//     <div style={{ width: "100%", padding: "20px" }}>
//       <h2>Profit Analysis Pie Chart</h2>

//       {/* Filters */}
//       <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
//         <div>
//           <label>From Date: </label>
//           <DatePicker
//             selected={fromDate}
//             onChange={(date) => { setFromDate(date); if (toDate && date > toDate) setToDate(null); }}
//             dateFormat="dd-MM-yyyy"
//           />
//         </div>

//         <div>
//           <label>To Date: </label>
//           <DatePicker
//             selected={toDate}
//             onChange={(date) => setToDate(date)}
//             dateFormat="dd-MM-yyyy"
//             minDate={fromDate}
//           />
//         </div>

//         <div>
//           <label>Product: </label>
//           <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
//             <option value="">All</option>
//             {products.map((p, i) => <option key={i} value={p}>{p}</option>)}
//           </select>
//         </div>

//         <div>
//           <label>Customer: </label>
//           <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
//             <option value="">All</option>
//             {customers.map((c, i) => <option key={i} value={c}>{c}</option>)}
//           </select>
//         </div>

//         <div>
//           <label>Salesman: </label>
//           <select value={selectedSalesman} onChange={(e) => setSelectedSalesman(e.target.value)}>
//             <option value="">All</option>
//             {salesmen.map((s, i) => <option key={i} value={s}>{s}</option>)}
//           </select>
//         </div>
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
//                 label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
//               >
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
//               <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
//             </PieChart>
//           </ResponsiveContainer>
//         )}
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import { format } from "date-fns";
// import "react-datepicker/dist/react-datepicker.css";

// export default function ProfitPieChart() {
//   const today = new Date();
//   const firstDate = new Date(today.getFullYear(), today.getMonth(), 1);

//   const [data, setData] = useState([]);
//   const [fromDate, setFromDate] = useState(firstDate);
//   const [toDate, setToDate] = useState(today);
//   const [loading, setLoading] = useState(false);

//   // Filters
//   const [products, setProducts] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [salesmen, setSalesmen] = useState([]);

//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [selectedCustomer, setSelectedCustomer] = useState("");
//   const [selectedSalesman, setSelectedSalesman] = useState("");

//   const COLORS = ["#ff7300", "#ffc658", "#82ca9d", "#8884d8", "#a4de6c", "#d0ed57"];

//   useEffect(() => {
//     const fetchChartData = async () => {
//       if (!fromDate || !toDate) return;

//       try {
//         setLoading(true);
//         const apiFrom = format(fromDate, "yyyy-MM-dd");
//         const apiTo = format(toDate, "yyyy-MM-dd");

//         const res = await axios.get("http://127.0.0.1:8000/api/profit-report-raw", {
//           params: {
//             from_date: apiFrom,
//             to_date: apiTo,
//             product_name: selectedProduct || undefined,
//             customer_name: selectedCustomer || undefined,
//             salesman_name: selectedSalesman || undefined,
//           },
//         });

//         const { data: chartData, filters } = res.data;

//         // Set dropdown options
//         setProducts(filters.products || []);
//         setCustomers(filters.customers || []);
//         setSalesmen(filters.salesmen || []);

//         if (!chartData || chartData.length === 0) {
//           setData([]);
//         } else {
//           let totalSales = 0,
//               totalCost = 0,
//               totalProfit = 0,
//               totalProfitOnSale = 0,
//               totalProfitOnCost = 0;

//           chartData.forEach((item) => {
//             totalSales += Number(item.sales);
//             totalCost += Number(item.cost);
//             totalProfit += Number(item.profit_amount);
//             totalProfitOnSale += Number(item.profit_percent);
//             totalProfitOnCost += Number(item.profit_percent_on_basic);
//           });

//           setData([
//             // Amounts
//             { name: "Sales", value: totalSales, type: "amount" },
//             { name: "Cost", value: totalCost, type: "amount" },
//             { name: "Profit", value: totalProfit, type: "amount" },
//             // Percentages
//             { name: "Profit on Sale (%)", value: totalProfitOnSale, type: "percent" },
//             { name: "Profit on Cost (%)", value: totalProfitOnCost, type: "percent" },
//           ]);
//         }
//       } catch (error) {
//         console.error("Error fetching chart data:", error);
//         setData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChartData();
//   }, [fromDate, toDate, selectedProduct, selectedCustomer, selectedSalesman]);

//   return (
//     <div style={{ width: "100%", padding: "20px" }}>
//       <h2>Profit Analysis Pie Chart</h2>

//       {/* Filters */}
//       <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
//         <div>
//           <label>From Date: </label>
//           <DatePicker
//             selected={fromDate}
//             onChange={(date) => { setFromDate(date); if (toDate && date > toDate) setToDate(null); }}
//             dateFormat="dd-MM-yyyy"
//           />
//         </div>

//         <div>
//           <label>To Date: </label>
//           <DatePicker
//             selected={toDate}
//             onChange={(date) => setToDate(date)}
//             dateFormat="dd-MM-yyyy"
//             minDate={fromDate}
//           />
//         </div>

//         <div>
//           <label>Product: </label>
//           <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
//             <option value="">All</option>
//             {products.map((p, i) => <option key={i} value={p}>{p}</option>)}
//           </select>
//         </div>

//         <div>
//           <label>Customer: </label>
//           <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
//             <option value="">All</option>
//             {customers.map((c, i) => <option key={i} value={c}>{c}</option>)}
//           </select>
//         </div>

//         <div>
//           <label>Salesman: </label>
//           <select value={selectedSalesman} onChange={(e) => setSelectedSalesman(e.target.value)}>
//             <option value="">All</option>
//             {salesmen.map((s, i) => <option key={i} value={s}>{s}</option>)}
//           </select>
//         </div>
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
//                 data={data.filter(d => d.type === "amount")}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={130}
//                 label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
//               >
//                 {data.filter(d => d.type === "amount").map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>

//               <Pie
//                 data={data.filter(d => d.type === "percent")}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={140}
//                 outerRadius={180}
//                 label={({ name, percent }) => `${name}: ${percent.toFixed(2)}`}
//               >
//                 {data.filter(d => d.type === "percent").map((entry, index) => (
//                   <Cell key={`cell-percent-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
//                 ))}
//               </Pie>

//               <Tooltip formatter={(value) => typeof value === "number" ? value.toFixed(2) : value} />
//               <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
//             </PieChart>
//           </ResponsiveContainer>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

export default function ProfitPieChart() {
  const today = new Date();
  const firstDate = new Date(today.getFullYear(), today.getMonth(), 1);

  const [data, setData] = useState({ amounts: [], percentages: [] });
  const [fromDate, setFromDate] = useState(firstDate);
  const [toDate, setToDate] = useState(today);
  const [loading, setLoading] = useState(false);

  // Filters
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salesmen, setSalesmen] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedSalesman, setSelectedSalesman] = useState("");

  const COLORS = ["#ff7300", "#ffc658", "#82ca9d", "#8884d8", "#a4de6c", "#d0ed57"];

  const fetchChartData = async () => {
    if (!fromDate || !toDate) return;

    try {
      setLoading(true);
      const apiFrom = format(fromDate, "yyyy-MM-dd");
      const apiTo = format(toDate, "yyyy-MM-dd");

      const res = await axios.get("http://127.0.0.1:8000/api/profit-chart", {
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

      if (!chartData || chartData.length === 0) {
        setData({ amounts: [], percentages: [] });
      } else {
        let totalSales = 0,
          totalCost = 0,
          totalProfit = 0,
          totalProfitOnSale = 0,
          totalProfitOnCost = 0;

        chartData.forEach((item) => {
          totalSales += Number(item.sales);
          totalCost += Number(item.cost);
          totalProfit += Number(item.profit_amount);
          totalProfitOnSale += Number(item.profit_percent);
          totalProfitOnCost += Number(item.profit_percent_on_basic);
        });

        setData({
          amounts: [
            { name: "Sales", value: totalSales },
            { name: "Cost", value: totalCost },
            { name: "Profit", value: totalProfit },
          ],
          percentages: [
            { name: "Profit on Sale (%)", value: totalProfitOnSale },
            { name: "Profit on Cost (%)", value: totalProfitOnCost },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setData({ amounts: [], percentages: [] });
    } finally {
      setLoading(false);
    }
  };

  // Construct no-data message based on applied filters
  const noDataMessagePie = [
    selectedProduct && `product "${selectedProduct}"`,
    selectedCustomer && `customer "${selectedCustomer}"`,
    selectedSalesman && `salesman "${selectedSalesman}"`,
  ].filter(Boolean).join(", ");

  useEffect(() => {
    fetchChartData();
  }, [fromDate, toDate, selectedProduct, selectedCustomer, selectedSalesman]);

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <h2>Profit Analysis Pie Charts</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <label>From Date: </label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => { setFromDate(date); if (toDate && date > toDate) setToDate(null); }}
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
      </div>

      {/* Charts or No Data */}
      <div style={{ width: "100%", height: 400, marginTop: 20 }}>
        {loading ? (
          <p style={{ textAlign: "center", marginTop: 180 }}>Loading charts...</p>
        ) : (!data.amounts.length && !data.percentages.length) ? (
          <p style={{ textAlign: "center", marginTop: 180, color: "#888", fontSize: 18 }}>
            No data found{noDataMessagePie ? ` for ${noDataMessagePie}` : ""}.
          </p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "50px", marginTop: 20 }}>
            {/* Amount Pie Chart */}
            <div style={{ width: "45%", height: 400 }}>
              <h3 style={{ textAlign: "center" }}>Amounts (₹)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.amounts}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                  >
                    {data.amounts.map((entry, index) => (
                      <Cell key={`cell-amount-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Percentage Pie Chart */}
            <div style={{ width: "50%", height: 400 }}>
              <h3 style={{ textAlign: "center" }}>Percentages (%)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.percentages}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
                  >
                    {data.percentages.map((entry, index) => (
                      <Cell key={`cell-percent-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
