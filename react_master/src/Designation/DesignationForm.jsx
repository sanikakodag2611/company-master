import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DesignationForm = () => {
  const [designations, setDesignations] = useState([]);
  const [formData, setFormData] = useState({
    designation_name: '',
    designation_abbreviation: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/designation');
    setDesignations(res.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://127.0.0.1:8000/api/designation/${editingId}`, formData);
    } else {
      await axios.post('http://127.0.0.1:8000/api/designation', formData);
    }
    setFormData({ designation_name: '', designation_abbreviation: '' });
    setEditingId(null);
    fetchDesignations();
  };

  const handleEdit = (designation) => {
    setFormData({
      designation_name: designation.designation_name,
      designation_abbreviation: designation.designation_abbreviation,
    });
    setEditingId(designation.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/designation/${id}`);
    fetchDesignations();
  };

  return (
    <div className="container">
      <h2>{editingId ? 'Edit' : 'Add'} Designation</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="designation_name"
          placeholder="Designation Name"
          value={formData.designation_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="designation_abbreviation"
          placeholder="Abbreviation"
          value={formData.designation_abbreviation}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      <h2>Designation List</h2>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Designation Name</th>
            <th>Abbreviation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {designations.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.designation_name}</td>
              <td>{d.designation_abbreviation}</td>
              <td>
                <button onClick={() => handleEdit(d)}>Edit</button>
                <button onClick={() => handleDelete(d.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DesignationForm;
