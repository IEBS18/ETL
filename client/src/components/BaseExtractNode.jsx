import { useCallback, useState } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import "../index.css";
import { memo } from "react";
import { addData } from './data.js';
import { removeData } from "./data.js";
import { addVisualize } from "./visualize";

function BaseExtractNode({ id, data, isConnectable, type }) {
  const [status, setStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [sheetName, setSheetName] = useState(null);
  const [sheet, setSheet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadSheetsClicked, setLoadSheetsClicked] = useState(false); // New state for XLSX Load Sheets button
  const { setNodes } = useReactFlow();
  const [error, setError] = useState(""); // State for error messages

  const { setTableData } = data;

  const userID = localStorage.getItem('user_minex_id')

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
      const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

      // Validate the selected file type
      if (file && fileExtension !== allowedFileExtensions[type]) {
        setError(`Invalid file type. Please select a ${type.toUpperCase()} file.`);
        setSelectedFile(null); // Reset file selection
        setSheetName(null); // Reset sheet name
        setSheet("");
        setStatus(""); // Clear status if there is an error
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

  // Function to handle sheet change for XLSX
  const onChangeSheet = useCallback((evt) => {
    setSheet(evt.target.value);
    setStatus(`${selectedFile.name} - Sheet "${evt.target.value}" selected. (Use it for query)`);
  }, [selectedFile]);

  // Function to delete the node
  const handleDelete = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    removeData(id, userID);
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
          setError(""); // Clear any errors
          setStatus(`${file.name} - Sheets loaded. Please select a sheet.`);
        } else {
          setError("No sheets found in the XLSX file.");
          setStatus(""); // Clear status if there is an error
        }
      } catch (error) {
        console.error("Error fetching sheet names:", error);
        setError("Failed to load sheets.");
        setStatus(""); // Clear status if there is an error
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("No file selected.");
      setStatus(""); // Clear status if there is an error
    }
  };

  // Function to handle extraction for all file types
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
        const endpoint = "http://127.0.0.1:5000/localextractsheet";

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const responseData = await response.json();
          console.log(data);
          if (!response.ok || data.error) {
            // Handle error from backend
            setError(data.error || "Failed to extract the file.");
            setStatus(""); // Clear status if there is an error
          } else {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === id
                  ? { ...node, data: { ...node.data, filePath: responseData.s3_path } }
                  : node
              )
            );
            const extractedData = {
              columns: responseData.columns,
              rows: (responseData.first_five_rows).slice(0,5),
            };
            const visualizeData = {
              columns: responseData.columns,
              rows: (responseData.first_five_rows),
            };

            const schema = responseData.schema;

            console.log(responseData.schema)
    
            console.log(extractedData);
            

            addData(id, file.name, extractedData , schema); 
            addVisualize(id, file.name, visualizeData, schema); 
    
            // Check if setTableData is a function before calling it
            if (typeof setTableData === 'function') {
              setTableData(extractedData);
            } else {
              console.error('setTableData is not a function');
            }
            setStatus(`File "${file.name}" Extracted, please connect to transform.`);
            setError(""); // Clear error if extraction is successful
          }
        } else {
          const text = await response.text();
          throw new Error(`Unexpected response: ${text}`);
        }
      } catch (error) {
        console.error("Error extracting file:", error);
        setError("Failed to extract the file. in catch");
        setStatus(""); // Clear status if there is an error
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("No file selected.");
      setStatus(""); // Clear status if there is an error
    }
  };

  return (
    <div
      className={`relative p-1 dndnode ${data.isConnecting ? "connecting" : ""}`}
      style={{
        borderRadius: "5px",
        border: `2px solid ${data.isConnecting ? "#7cfc00" : "#1a192b"}`,
        width: "150px",
        height: "auto",
        fontSize: "10px",
      }}
    >
      <button onClick={handleDelete} className="absolute top-0 right-0 p-1 text-red-500 text-sm">
        &times;
      </button>
      <div className="text-[10px] flex flex-col p-2">
        <label htmlFor="file" className="text-[10px] text-center font-bold text-black">
          Upload {type.toUpperCase()} File
        </label>
        <input id="file" name="file" type="file" onChange={onChange} className="nodrag mt-2 text-[8px]" />

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

        {type === "xlsx" && sheetName && loadSheetsClicked && (
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
            disabled={isLoading || (type === "xlsx" && !sheet)} // Ensure the sheet is selected for XLSX before enabling extract
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

        {/* Only show one of the error or status */}
        {error ? (
          <p className="mt-1 text-[6px] text-center font-bold text-red-500">{error}</p>
        ) : (
          status && <p className="mt-1 text-[6px] text-center font-bold text-green-500">{status}</p>
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
