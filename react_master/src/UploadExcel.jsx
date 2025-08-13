import React, { useState, useRef, useCallback, memo } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Helper: Convert Excel serial date (number) to JS Date
function excelDateToJSDate(serial) {
   
  if (typeof serial !== "number") return null;
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400 * 1000;
  const date_info = new Date(utc_value);
  return date_info;
}

function UploadExcel() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [skippedRows, setSkippedRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [activeEdit, setActiveEdit] = useState({ rowId: null, key: null });

  const fileInputRef = useRef();

  const keyMap = {
    no: ["no", "invoice_no", "invoice no", "invoiceno", "invoice_number"],
    date: ["date", "invoice_date", "invoice date", "dateofinvoice"],
    customer: ["customer", "customer_name", "client", "client_name"],
    salesman: ["salesman", "sales_person", "sales person", "salesman_name"],
    bill_amount: ["bill_amount", "bill amount", "amount", "billamount", "total_amount"],
    city: ["city", "location", "town"],
    item: ["item", "product", "description", "product_description"],
    qty: ["qty", "quantity", "qtyordered"],
    rate: ["rate", "price", "unit_price"],
    destination: ["destination", "dest", "ship_to"],
    tax_amount: ["tax_amount", "tax amount", "tax", "taxamt"],
  };

  const displayedColumns = Object.keys(keyMap);

  const columnLabels = {
    no: "Invoice No",
    date: "Date",
    customer: "Customer",
    salesman: "Salesman",
    bill_amount: "Bill Amount",
    city: "City",
    item: "Item",
    qty: "Qty",
    rate: "Rate",
    destination: "Destination",
    tax_amount: "Tax Amount",
  };

  // Normalize keys of incoming row
  const normalizeRowKeys = (row) => {
    const lowerCaseRow = {};
    Object.keys(row).forEach((k) => {
      lowerCaseRow[k.toLowerCase().replace(/\s|_/g, "")] = row[k];
    });

    const normalized = {};
    for (const [standardKey, aliases] of Object.entries(keyMap)) {
      normalized[standardKey] = "";
      for (const alias of aliases) {
        const normAlias = alias.replace(/\s|_/g, "");
        if (lowerCaseRow.hasOwnProperty(normAlias)) {
          normalized[standardKey] = lowerCaseRow[normAlias];
          break;
        }
      }
    }
    return normalized;
  };

  const handleFileChange = useCallback((e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setSkippedRows([]);
    setSelectedRows([]);
    setActiveEdit({ rowId: null, key: null });
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file) {
      alert("Please select an Excel file!");
      return;
    }
    setUploadLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("http://localhost:8000/api/upload-invoice", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message || "Upload completed");

      const skipped = Array.isArray(res.data.skipped)
        ? res.data.skipped.map((row) => {
            const normalized = normalizeRowKeys(row);
            // Convert Excel date if numeric
            let dateValue = normalized.date;
            if (typeof dateValue === "number") {
              const jsDate = excelDateToJSDate(dateValue);
              normalized.date = jsDate ? jsDate.toISOString().split("T")[0] : dateValue;
            }
            return { ...normalized, rowId: uuidv4() };
          })
        : [];

      setSkippedRows(skipped);

      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Upload failed: " + err.message);
    } finally {
      setUploadLoading(false);
    }
  }, [file]);

  const toggleSelection = useCallback(
    (rowId) => {
      setSelectedRows((prev) =>
        prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
      );
    },
    []
  );

  const toggleSelectAll = useCallback(
    (checked) => {
      const allIds = skippedRows.map((row) => row.rowId);
      setSelectedRows(checked ? allIds : []);
    },
    [skippedRows]
  );

  const handleEditCell = useCallback((rowId, key, value) => {
    setSkippedRows((prev) =>
      prev.map((row) => (row.rowId === rowId ? { ...row, [key]: value } : row))
    );
  }, []);

  const focusCell = useCallback((rowId, key) => {
    setActiveEdit({ rowId, key });
  }, []);

  const exitEditMode = useCallback(() => {
    setActiveEdit({ rowId: null, key: null });
  }, []);

  const validateBeforeUpdate = useCallback((rows) => {
    for (const row of rows) {
      for (const key of Object.keys(row)) {
        const val = row[key];
        if (key.toLowerCase().includes("date") && val && isNaN(Date.parse(val))) {
          alert(`Invoice No ${row.no || "N/A"}: Invalid date format in "${key}"`);
          return false;
        }
        if (key.toLowerCase().includes("amount") && val && isNaN(Number(val))) {
          alert(`Invoice No ${row.no || "N/A"}: "${key}" must be numeric`);
          return false;
        }
        if (key.toLowerCase() === "qty" && val && isNaN(Number(val))) {
          alert(`Invoice No ${row.no || "N/A"}: "qty" must be numeric`);
          return false;
        }
      }
    }
    return true;
  }, []);

  const updateSelected = useCallback(async () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row to update.");
      return;
    }
    setUpdateLoading(true);

    const rowsToUpdate = skippedRows.filter((row) => selectedRows.includes(row.rowId));

    const rowsToSend = rowsToUpdate.map((row) => ({
      ...row,
      originalNo: row.no,
    }));

    if (!validateBeforeUpdate(rowsToSend)) {
      setUpdateLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/invoices/update-duplicates", {
        rows: rowsToSend,
      });

      setMessage(response.data.message || "Selected records updated successfully!");
      setSkippedRows((prev) => prev.filter((row) => !selectedRows.includes(row.rowId)));
      setSelectedRows([]);
      exitEditMode();
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message || err);
      alert("Failed to update records. Please check console for details.");
    } finally {
      setUpdateLoading(false);
    }
  }, [selectedRows, skippedRows, validateBeforeUpdate, exitEditMode]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Excel File</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={uploadLoading || updateLoading}
        />
        <button onClick={handleUpload} disabled={!file || uploadLoading || updateLoading}>
          {uploadLoading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {message && <p style={{ marginTop: 12 }}>{message}</p>}

      {skippedRows.length > 0 && (
        <>
          <h3>Skipped Rows (Incoming Duplicates)</h3>

          <div style={{ marginBottom: 10 }}>
            <button
              onClick={updateSelected}
              disabled={selectedRows.length === 0 || updateLoading}
              style={{
                background: selectedRows.length === 0 ? "#ddd" : "#4CAF50",
                color: selectedRows.length === 0 ? "#666" : "#fff",
                border: "none",
                padding: "6px 12px",
                cursor: selectedRows.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              {updateLoading ? "Updating..." : `Update Selected (${selectedRows.length})`}
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      aria-label="Select all skipped rows"
                      checked={selectedRows.length === skippedRows.length && skippedRows.length > 0}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                  </th>
                  {displayedColumns.map((col) => (
                    <th key={col}>{columnLabels[col] || col.replace(/_/g, " ").toUpperCase()}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {skippedRows.map((row) => (
                  <Row
                    key={row.rowId}
                    row={row}
                    headers={displayedColumns}
                    isSelected={selectedRows.includes(row.rowId)}
                    toggleSelection={toggleSelection}
                    handleEditCell={handleEditCell}
                    focusCell={focusCell}
                    activeEdit={activeEdit}
                    exitEditMode={exitEditMode}
                    updateLoading={updateLoading}
                  />
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
  updateLoading,
}) {
  return (
    <tr>
      <td style={{ textAlign: "center" }}>
        <input
          type="checkbox"
          aria-label={`Select row invoice no ${row.no || "N/A"}`}
          checked={isSelected}
          onChange={() => !updateLoading && toggleSelection(row.rowId)}
          disabled={updateLoading}
        />
      </td>
      {headers.map((key) => {
        const editing =
          activeEdit.rowId === row.rowId && activeEdit.key === key && isSelected && !updateLoading;

        const isEditable = key !== "no";  

        const displayValue = row[key] ?? "N/A";

        return (
          <td
            key={key}
            onClick={(e) => {
              e.stopPropagation();
              if (isSelected && !updateLoading && isEditable) focusCell(row.rowId, key);
            }}
            style={{ cursor: isSelected && !updateLoading && isEditable ? "pointer" : "default" }}
          >
            {editing && isEditable ? (
              <input
                autoFocus
                value={displayValue}
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
              displayValue
            )}
          </td>
        );
      })}
    </tr>
  );
});

export default UploadExcel;
