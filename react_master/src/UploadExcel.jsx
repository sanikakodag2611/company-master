import React, { useState, useRef, useCallback, memo } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function UploadExcel() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [skippedRows, setSkippedRows] = useState([]);
  const [existingDuplicates, setExistingDuplicates] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeEdit, setActiveEdit] = useState({ rowId: null, key: null });

  const fileInputRef = useRef();

  /** Handle file selection */
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setSkippedRows([]);
    setExistingDuplicates([]);
    setSelectedRows([]);
    setActiveEdit({ rowId: null, key: null });
  };

  /** Upload file and receive skipped + duplicate data */
  const handleUpload = async () => {
    if (!file) return alert("Please select an Excel file!");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/api/upload-invoice", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message || "Upload completed");

      // Add stable unique IDs to skipped rows
      const skipped = Array.isArray(res.data.skipped)
        ? res.data.skipped.map((row) => ({ ...row, rowId: uuidv4() }))
        : [];

      setSkippedRows(skipped);
      setExistingDuplicates(
        Array.isArray(res.data.existingDuplicates) ? res.data.existingDuplicates : []
      );

      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Toggle single row selection */
  const toggleSelection = (rowId) => {
    setSelectedRows((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  };

  /** Toggle select/deselect all skipped rows */
  const toggleSelectAll = (checked) => {
    const allIds = skippedRows.map((row) => row.rowId);
    setSelectedRows(checked ? allIds : []);
  };

  /** Edit cell content */
  const handleEditCell = useCallback((rowId, key, value) => {
    setSkippedRows((prev) =>
      prev.map((row) =>
        row.rowId === rowId ? { ...row, [key]: value } : row
      )
    );
  }, []);

  /** Focus on editable cell */
  const focusCell = (rowId, key) => {
    setActiveEdit({ rowId, key });
  };

  /** Exit editing mode */
  const exitEditMode = () => {
    setActiveEdit({ rowId: null, key: null });
  };

  /** Validate rows before sending update */
  const validateBeforeUpdate = (rows) => {
    for (const row of rows) {
      for (const key of Object.keys(row)) {
        const val = row[key];
        if (key.toLowerCase().includes("date") && val && isNaN(Date.parse(val))) {
          alert(`Row ${row.no}: Invalid date format in "${key}"`);
          return false;
        }
        if (key.toLowerCase().includes("amount") && val && isNaN(Number(val))) {
          alert(`Row ${row.no}: "${key}" must be numeric`);
          return false;
        }
      }
    }
    return true;
  };

  /** Update selected rows */
  const updateSelected = async () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row to update.");
      return;
    }

    // Get rows to update from skippedRows
    const rowsToUpdate = skippedRows.filter((row) =>
      selectedRows.includes(row.rowId)
    );

    // Optionally send originalNo if backend needs it
    const rowsWithOriginalId = rowsToUpdate.map((row) => ({
      ...row,
      originalNo: row.no,
    }));

    if (!validateBeforeUpdate(rowsWithOriginalId)) return;

    try {
      await axios.post("http://localhost:8000/api/invoices/update-duplicates", {
        rows: rowsWithOriginalId,
      });

      // Remove updated rows from skippedRows
      setSkippedRows((prev) => prev.filter((row) => !selectedRows.includes(row.rowId)));

      // Remove updated rows from existingDuplicates by matching normalized 'no'
      const updatedNos = new Set(
        rowsToUpdate.map((r) => r.no?.toString().trim().toUpperCase())
      );

      setExistingDuplicates((prev) =>
        prev.filter((dup) => !updatedNos.has(dup.no?.toString().trim().toUpperCase()))
      );

      setSelectedRows([]);
      exitEditMode();
      setMessage("Selected records updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update records.");
    }
  };

  // Derive table headers from skippedRows (exclude rowId)
  const headers = skippedRows.length > 0 ? Object.keys(skippedRows[0]).filter((h) => h !== "rowId") : [];

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Excel File</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={loading}
        />
        <button onClick={handleUpload} disabled={!file || loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {message && <p style={{ marginTop: 12 }}>{message}</p>}

      {skippedRows.length > 0 && (
        <>
          <h3>Skipped Rows (Incoming Duplicates)</h3>

          <div style={{ marginBottom: 10 }}>
            <button
              onClick={updateSelected}
              disabled={selectedRows.length === 0}
              style={{
                background: selectedRows.length === 0 ? "#ddd" : "#4CAF50",
                color: selectedRows.length === 0 ? "#666" : "#fff",
                border: "none",
                padding: "6px 12px",
                cursor: selectedRows.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              Update Selected ({selectedRows.length})
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              border="1"
              cellPadding="6"
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedRows.length === skippedRows.length && skippedRows.length > 0}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                  </th>
                  {headers.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {skippedRows.map((row) => (
                  <Row
                    key={row.rowId}
                    row={row}
                    headers={headers}
                    isSelected={selectedRows.includes(row.rowId)}
                    toggleSelection={toggleSelection}
                    handleEditCell={handleEditCell}
                    focusCell={focusCell}
                    activeEdit={activeEdit}
                    exitEditMode={exitEditMode}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {existingDuplicates.length > 0 && (
        <>
          <h3>Existing Duplicates in Database</h3>

          <div style={{ overflowX: "auto", marginTop: 16 }}>
            <table
              border="1"
              cellPadding="6"
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  {Object.keys(existingDuplicates[0]).map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {existingDuplicates.map((row, idx) => (
                  <tr key={idx}>
                    {Object.keys(row).map((h) => (
                      <td key={h}>{row[h] ?? "N/A"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

const Row = memo(function Row({
  row,
  headers,
  isSelected,
  toggleSelection,
  handleEditCell,
  focusCell,
  activeEdit,
  exitEditMode,
}) {
  return (
    <tr>
      <td style={{ textAlign: "center" }}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelection(row.rowId)}
        />
      </td>
      {headers.map((key) => {
        const editing = activeEdit.rowId === row.rowId && activeEdit.key === key && isSelected;
        return (
          <td
            key={key}
            onClick={(e) => {
              e.stopPropagation();
              if (isSelected) focusCell(row.rowId, key);
            }}
          >
            {editing ? (
              <input
                autoFocus
                value={row[key] ?? ""}
                onChange={(e) => handleEditCell(row.rowId, key, e.target.value)}
                style={{ padding: "4px", border: "1px solid #ccc", width: "100%" }}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape") {
                    e.preventDefault();
                    exitEditMode();
                  }
                }}
              />
            ) : (
              row[key] ?? "N/A"
            )}
          </td>
        );
      })}
    </tr>
  );
});

export default UploadExcel;
