import { useCallback, useState } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import "../index.css";
import { memo } from "react";

function BaseExtractNode({ id, data, isConnectable, type }) {
  const [status, setStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [sheetName, setSheetName] = useState(null);
  const [sheet, setSheet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadSheetsClicked, setLoadSheetsClicked] = useState(false); // New state for XLSX Load Sheets button
  const { setNodes } = useReactFlow();
  const [error, setError] = useState(""); // State for error messages

  const allowedFileExtensions = {
    csv: ".csv",
    json: ".json",
    xml: ".xml",
    xlsx: ".xlsx",
  };

  // Function to handle file change
  const onChange = useCallback(
    (evt) => {
      const file = evt.target.files[0];
      const fileExtension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();

      // Validate the selected file type
      if (file && fileExtension !== allowedFileExtensions[type]) {
        setStatus(null);
        setError(
          `Invalid file type. Please select a ${type.toUpperCase()} file.`
        );
        setSelectedFile(null); // Reset file selection
        setSheetName(null); // Reset sheet name
        setSheet("");
        return;
      }

      setSelectedFile(file);
      setStatus(`${file.name} selected.`);
      setSheetName(null);
      setSheet("");
      setLoadSheetsClicked(false);
      setError(""); // Reset the error message if the file type is valid

      // Automatically show the extract button for CSV, JSON, XML files
      if (file && (type === "csv" || type === "json" || type === "xml")) {
        setLoadSheetsClicked(true);
      }
    },
    [type]
  );

  // Function to handle sheet change
  const onChangeSheet = useCallback((evt) => {
    setSheet(evt.target.value);
  }, []);

  // Function to delete the node
  const handleDelete = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
  };

  // Function to handle sheet loading for XLSX files
  const handleSheets = async (file) => {
    if (file) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://127.0.0.1:5000/localextract", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        if (data.sheet_names) {
          setSheetName(data.sheet_names); // Load sheet names
          setLoadSheetsClicked(true); // Show dropdown after sheets are loaded
          setError("");

          // If there is only one sheet, auto-select it and show the extract button
          if (data.sheet_names.length === 1) {
            setStatus(`Sheet "${data.sheet_names[0]}" selected.`);
            setSheet(data.sheet_names[0]); // Set the sheet automatically
          }
        } else {
          setStatus(null);
          setError("No sheets found in the XLSX file.");
        }
      } catch (error) {
        console.error("Error fetching sheet names:", error);
        setError("Failed to load sheets.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setStatus(null);
      setError("No file selected.");
    }
  };

  // Function to handle extraction
  const handleExtract = async (file) => {
    if (file) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      // Append sheetName only for XLSX
      if (type === "xlsx" && sheet) {
        formData.append("sheetName", sheet);
      }

      try {
        const endpoint =
          type === "csv" || type === "json" || type === "xml"
            ? "http://127.0.0.1:5000/localextractsheet"
            : "http://127.0.0.1:5000/localextract";

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setNodes((nds) =>
          nds.map((node) =>
            node.id === id
              ? { ...node, data: { ...node.data, filePath: data.s3_path } }
              : node
          )
        );
        setStatus("File Extracted, please connect to transform.");
      } catch (error) {
        console.error("Error extracting file:", error);
        setStatus(null);
        setError("Failed to extract the file.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setStatus(null);
      setError("No file selected.");
    }
  };

  return (
    <div
      className={`relative p-1 dndnode ${
        data.isConnecting ? "connecting" : ""
      }`}
      style={{
        borderRadius: "5px",
        border: `2px solid ${data.isConnecting ? "#7cfc00" : "#1a192b"}`,
        width: "150px",
        height: "auto",
        fontSize: "10px",
      }}
    >
      <button
        onClick={handleDelete}
        className="absolute top-0 right-0 p-1 text-red-500 text-sm"
      >
        &times;
      </button>
      <div className="text-[10px] flex flex-col p-2">
        <label
          htmlFor="file"
          className="text-[10px] text-center font-bold text-black"
        >
          Upload {type.toUpperCase()} File
        </label>
        <input
          id="file"
          name="file"
          type="file"
          onChange={onChange}
          className="nodrag mt-2 text-[8px]"
        />

        {/* For XLSX files, display Load Sheets button, then dropdown if multiple sheets are available */}
        {type === "xlsx" && selectedFile && !loadSheetsClicked && (
          <button
            className="bg-black text-white p-1 w-auto self-center mt-2 text-[10px]"
            onClick={() => handleSheets(selectedFile)} // Load sheets on button click
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner" /> Loading Sheets...
              </>
            ) : (
              "Load Sheets"
            )}
          </button>
        )}

        {type === "xlsx" &&
          sheetName &&
          sheetName.length > 1 &&
          loadSheetsClicked && (
            <select
              id="sheetName"
              name="sheetName"
              onChange={onChangeSheet}
              className="nodrag mt-2 text-[10px] bg-white border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 block w-full p-1"
            >
              <option value="">Select the Sheet:</option>
              {sheetName?.map((file, index) => (
                <option key={index} value={file}>
                  {file}
                </option>
              ))}
            </select>
          )}

        {/* Show Extract button for CSV, JSON, XML or after loading XLSX sheets */}
        {selectedFile && (loadSheetsClicked || type !== "xlsx") && (
          <button
            className="bg-black text-white p-1 w-auto self-center mt-2 text-[10px]"
            onClick={() => handleExtract(selectedFile)} // Pass selectedFile directly
            disabled={
              isLoading ||
              (type === "xlsx" && !sheet && sheetName && sheetName.length > 1)
            }
          >
            {isLoading ? (
              <>
                <span className="spinner" /> Extracting...
              </>
            ) : (
              "Extract"
            )}
          </button>
        )}

        {error && (
          <p className="mt-1 text-[6px] text-center font-bold text-red-500">
            {error}
          </p>
        )}
        {status && (
          <p className="mt-1 text-[6px] text-center font-bold text-green-500">
            {status}
          </p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
        style={{ right: "-4px", top: "50%", transform: "translateY(-50%)" }}
      />
    </div>
  );
}

export default memo(BaseExtractNode);
