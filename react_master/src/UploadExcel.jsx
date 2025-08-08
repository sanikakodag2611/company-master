import React, { useState } from 'react';
import axios from 'axios';

function UploadExcel() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an Excel file!");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/api/upload-invoice', formData);
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Upload failed: " + error.message);
    }
  };

  return (
    <div>
      <h2>Upload Excel File</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadExcel;
