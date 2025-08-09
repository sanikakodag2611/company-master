import React, { useState, useEffect, useRef } from 'react'; 
import axios from 'axios';

function UploadExcel() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [skippedRows, setSkippedRows] = useState([]);
  const [existingDuplicates, setExistingDuplicates] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setSkippedRows([]);
    setExistingDuplicates([]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an Excel file!");
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/api/upload-invoice', formData);

      setMessage(res.data.message || "Upload completed");

      if (res.data.skipped && Array.isArray(res.data.skipped)) {
        setSkippedRows(res.data.skipped);
      } else {
        setSkippedRows([]);
      }

      if (res.data.existingDuplicates && Array.isArray(res.data.existingDuplicates)) {
        setExistingDuplicates(res.data.existingDuplicates);
      } else {
        setExistingDuplicates([]);
      }

      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Upload failed: " + error.message);
      }
    }

    setLoading(false);
  };

  // Helper to render table with dynamic headers and rows
  const renderTable = (data) => {
    if (!data.length) return null;

    const headers = Object.keys(data[0]);

    return (
      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', marginTop: 10 }}>
        <thead>
          <tr>
            {headers.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {headers.map((key) => (
                <td key={key}>{row[key] ?? 'N/A'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Excel File</h2>
      <input 
        type="file" 
        accept=".xlsx, .xls" 
        onChange={handleFileChange} 
        ref={fileInputRef} 
        disabled={loading}
      />
      <button 
        onClick={handleUpload} 
        style={{ marginLeft: 10 }} 
        disabled={!file || loading}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {message && <p style={{ marginTop: 10 }}>{message}</p>}

      {skippedRows.length > 0 && (
        <>
          <h3>Skipped Rows (Incoming Duplicates)</h3>
          {renderTable(skippedRows)}
        </>
      )}

      {existingDuplicates.length > 0 && (
        <>
          <h3>Existing Duplicates in Database</h3>
          {renderTable(existingDuplicates)}
        </>
      )}
    </div>
  );
}

export default UploadExcel;
