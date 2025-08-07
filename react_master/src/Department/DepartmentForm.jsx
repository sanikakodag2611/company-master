import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DepartmentForm = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    department_name: '',
    department_abbreviation: '',
    status: '',
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://127.0.0.1:8000/api/departments/${editId}`, formData);
      } else {
        await axios.post('http://127.0.0.1:8000/api/departments', formData);
      }
      fetchDepartments();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      department_name: '',
      department_abbreviation: '',
      status: '',
    });
    setEditId(null);
  };

  const handleEdit = (dept) => {
  setFormData({
    department_name: dept.department_name || '',
    department_abbreviation: dept.department_abbreviation || '',
    status: dept.status !== undefined ? dept.status.toString() : '',
  });
  setEditId(dept.id);
};


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/departments/${id}`);
        fetchDepartments();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h2>{editId ? 'Edit' : 'Add'} Department</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="department_name"
          placeholder="Department Name"
          value={formData.department_name}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="department_abbreviation"
          placeholder="Abbreviation"
          value={formData.department_abbreviation}
          onChange={handleChange}
          required
        />
        <br />
        <select name="status" value={formData.status} onChange={handleChange}>
        <option  >Select Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
        <br /><br/>
        <button type="submit">{editId ? 'Update' : 'Create'}</button>
        {editId && <button onClick={resetForm}>Cancel</button>}
      </form>

      <h3>Department List</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Abbreviation</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.id}>
              <td>{dept.id}</td>
              <td>{dept.department_name}</td>
              <td>{dept.department_abbreviation}</td>

              <td>{dept.status === 1 ? 'Active' : 'Inactive'}</td>
              <td>
                <button onClick={() => handleEdit(dept)}>Edit</button>
                <button onClick={() => handleDelete(dept.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentForm;
