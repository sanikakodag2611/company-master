import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar'; 
import Login from './login';
import AddEmployee from './AddEmployee';
import DepartmentForm from './Department/DepartmentForm';
import DesignationForm from './Designation/DesignationForm';
import CompanyMasterForm from './Company/CompanyMasterForm';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/add-department" element={< DepartmentForm />} />
          <Route path="/designations" element={<DesignationForm />} />
          <Route path="/company" element={<CompanyMasterForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
