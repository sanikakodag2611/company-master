import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    employee_name: '',
    email: '',
    username: '',
    password: '',
    contact_no: '',
    address: '',
    date_of_birth: '',
    gender: '',
    state_id: '',
    city: '',
    pan_card: '',
    designation_id: '',
    department_id: '',
    company_id: '',
    year_id: '',
    status: '',
  });

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [years, setYears] = useState([]);
  const [states, setStates] = useState([]);

  const isLoggedIn = localStorage.getItem('auth_token');

  useEffect(() => {
    axios.get('http://localhost:8000/api/departments').then(res => setDepartments(res.data));
    axios.get('http://localhost:8000/api/designation').then(res => setDesignations(res.data));
    axios.get('http://localhost:8000/api/company').then(res => setCompanies(res.data));
    axios.get('http://localhost:8000/api/years').then(res => setYears(res.data));
    axios.get('http://127.0.0.1:8000/api/states').then(res => setStates(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const isLoggedIn = !!localStorage.getItem('auth_token');

  const url = isLoggedIn
    ? 'http://localhost:8000/api/employee'   
    : 'http://localhost:8000/api/employees/public-create';   

  const headers = {};

  if (isLoggedIn) {
    headers['Authorization'] = `Bearer ${localStorage.getItem('auth_token')}`;
  }

  axios.post(url, formData, { headers })
    .then(() => {
      alert("Employee added successfully");
      setFormData({
        employee_name: '',
        email: '',
        username: '',
        password: '',
        contact_no: '',
        address: '',
        date_of_birth: '',
        gender: '',
        state_id: '',
        city: '',
        pan_card: '',
        designation_id: '',
        department_id: '',
        company_id: '',
        year_id: '',
        status: '',
      });
    })
    .catch(err => {
      if (err.response && err.response.data) {
        const errors = err.response.data.errors;
        if (errors) {
          const errorMessages = Object.values(errors).flat().join('\n');
          alert("Validation Errors:\n" + errorMessages);
        } else {
          alert(err.response.data.message || "Failed to add employee");
        }
      } else {
        alert("Server error. Please try again later.");
      }
    });
};

  return (
    <div>
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <input name="employee_name" value={formData.employee_name} onChange={handleChange} placeholder="Employee Name" required /><br /><br />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required /><br /><br />
        <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required /><br /><br />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required /><br /><br />
        <input name="contact_no" value={formData.contact_no} onChange={handleChange} placeholder="Contact No" required /><br /><br />
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" required /><br /><br />
        DOB: <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required /><br /><br />
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select><br /><br />
        <select name="state_id" value={formData.state_id} onChange={handleChange} required>
          <option value="">Select State</option>
          {states.map(state => (
            <option key={state.id} value={state.state_id}>{state.state_name}</option>
          ))}
        </select><br /><br />
        <input name="city" value={formData.city} onChange={handleChange} placeholder="City" required /><br /><br />
        <input name="pan_card" value={formData.pan_card} onChange={handleChange} placeholder="PAN Card" required /><br /><br />
        <select name="designation_id" value={formData.designation_id} onChange={handleChange} required>
          <option value="">Select Designation</option>
          {designations.map(des => (
            <option key={des.id} value={des.id}>{des.designation_name}</option>
          ))}
        </select><br /><br />
        <select name="department_id" value={formData.department_id} onChange={handleChange} required>
          <option value="">Select Department</option>
          {departments.map(dep => (
            <option key={dep.id} value={dep.id}>{dep.department_name}</option>
          ))}
        </select><br /><br />

      
        {!isLoggedIn && (
          <>
            <select name="company_id" value={formData.company_id} onChange={handleChange} required>
              <option value="">Select Company</option>
              {companies.map(comp => (
                <option key={comp.id} value={comp.id}>{comp.company_name}</option>
              ))}
            </select><br /><br />
            <select name="year_id" value={formData.year_id} onChange={handleChange} required>
              <option value="">Select Year</option>
              {years.map(yr => (
                <option key={yr.id} value={yr.id}>{yr.year_name}</option>
              ))}
            </select><br /><br />
          </>
        )}

        

        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="">Select Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select><br /><br />
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;
