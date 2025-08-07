import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanyMasterForm = () => {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    country_id: '',
    state_id: '',
    city: '',
    company_address: '',
    gstin_uin: '',
    pan_no: '',
    contact_no: '',
    email: '',
    website: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    fetchCompanies();
    fetchCountries();
    fetchStates();
  }, []);

  const fetchCompanies = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/company');
    setCompanies(res.data);
  };

  const fetchCountries = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/countries');
    setCountries(res.data);
  };

  const fetchStates = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/states');
    setStates(res.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/api/company/${editingId}`, formData);
      } else {
        await axios.post('http://127.0.0.1:8000/api/company', formData);
      }
      setFormData({
        company_name: '',
        contact_person: '',
        country_id: '',
        state_id: '',
        city: '',
        company_address: '',
        gstin_uin: '',
        pan_no: '',
        contact_no: '',
        email: '',
        website: '',
      });
      setEditingId(null);
      fetchCompanies();
    } catch (error) {
  if (error.response && error.response.status === 422) {
    console.log('Validation Errors:', error.response.data.errors);
    alert('Validation error. Check console for details.');
  } else {
    console.error('Unexpected Error:', error);
  }
}

  };

  const handleEdit = (company) => {
    setFormData(company);
    setEditingId(company.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      await axios.delete(`http://127.0.0.1:8000/api/company/${id}`);
      fetchCompanies();
    }
  };

  return (
    <div className="container">
      <h2>{editingId ? 'Edit Company' : 'Add Company'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="company_name" placeholder="Company Name" value={formData.company_name} onChange={handleChange} required />
        <input type="text" name="contact_person" placeholder="Contact Person" value={formData.contact_person} onChange={handleChange} required />
        <select name="country_id" onChange={handleChange}>
  <option value="">Select Country</option>
  {countries.map((country) => (
    <option key={country.id} value={country.country_id}>
      {country.country_name}
    </option>
  ))}
</select>

        <select name="state_id" value={formData.state_id} onChange={handleChange} required>
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s.id} value={s.state_id}>{s.state_name}</option>
          ))}
        </select>

          
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
        <input type="text" name="company_address" placeholder="Address" value={formData.company_address} onChange={handleChange} />
        <input type="text" name="gstin_uin" placeholder="GSTIN/UIN" value={formData.gstin_uin} onChange={handleChange} />
        <input type="text" name="pan_no" placeholder="PAN No" value={formData.pan_no} onChange={handleChange} />
        <input type="text" name="contact_no" placeholder="Contact No" value={formData.contact_no} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input type="text" name="website" placeholder="Website" value={formData.website} onChange={handleChange} />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      <h3>Company List</h3>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Company</th>
            <th>Contact</th>
            <th>Country</th>
            <th>State</th>
            <th>City</th>
            <th>GSTIN</th>
            <th>PAN</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Website</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.company_name}</td>
              <td>{c.contact_person}</td>
<td>{c.country_id}</td>
<td>{c.state_id}</td>

              <td>{c.city}</td>
              <td>{c.gstin_uin}</td>
              <td>{c.pan_no}</td>
              <td>{c.contact_no}</td>
              <td>{c.email}</td>
              <td>{c.website}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyMasterForm;
