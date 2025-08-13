import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar'; 
import Login from './login';
import AddEmployee from './AddEmployee';
import DepartmentForm from './Department/DepartmentForm';
import DesignationForm from './Designation/DesignationForm';
import CompanyMasterForm from './Company/CompanyMasterForm';
import UploadExcel from './UploadExcel';
import ProfitChart from './BarChart';
import ProfitLineChart from './LineChart';
import ProfitPieChart from './PieChart';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/add-employee" replace /> : <Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/"
            element={<Navigate to={isLoggedIn ? "/add-employee" : "/login"} replace />}
          />
          {/* Public route */}
          <Route path="/add-employee" element={<AddEmployee />} />
          {/* Protected routes */}
          <Route
            path="/add-department"
            element={isLoggedIn ? <DepartmentForm /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/designations"
            element={isLoggedIn ? <DesignationForm /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/company"
            element={isLoggedIn ? <CompanyMasterForm /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/upload"
            element={isLoggedIn ? <UploadExcel /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/bar-chart"
            element={isLoggedIn ? <ProfitChart/> : <Navigate to="/login" replace />}
          />
          <Route
            path="/line-chart"
            element={isLoggedIn ? <ProfitLineChart/> : <Navigate to="/login" replace />}
          />

          <Route
            path="/pie-chart"
            element={isLoggedIn ? <ProfitPieChart/> : <Navigate to="/login" replace />}
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
