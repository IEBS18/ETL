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
  const { setNodes } = useReactFlow();
  const [error, setError] = useState(""); // New state for error messages

  const allowedFileExtensions = {
    csv: ".csv",
    json: ".json",
    xml: ".xml",
    xlsx: ".xlsx",
  };

  const onChange = useCallback(
    (evt) => {
      const file = evt.target.files[0];
      const fileExtension = file.name.substring(file.name.lastIndexOf("."));

      // Validate the selected file type
      if (file && fileExtension !== allowedFileExtensions[type]) {
        setError(
          `Invalid file type. Please select a ${type.toUpperCase()} file.`
        );
        setSelectedFile(null); // Reset file selection
        setSheetName(null); // Reset sheet name
        return;
      }

      setSelectedFile(file);
      setSheetName(null);
      setSheet("");
      setError(""); // Reset the error message if the file type is valid

      // Automatically extract for CSV, JSON, XML files
      if (file) {
        if (
          fileExtension === ".csv" ||
          fileExtension === ".json" ||
          fileExtension === ".xml"
        ) {
          handleExtract();
        }
      }
    },
    [type]
  );

  const onChangeSheet = useCallback((evt) => {
    setSheet(evt.target.value);
  }, []);

  const handleDelete = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
  };

  const handleSheets = async () => {
    if (selectedFile) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch("http://127.0.0.1:5000/localextract", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setSheetName(data.sheet_names);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error("No file selected");
    }
  };

  const handleExtract = async () => {
    if (selectedFile) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Append sheetName only for XLSX
      if (type === "xlsx") {
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
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
        setStatus("File Extracted, please connect to transform.");
      }
    } else {
      console.error("No file selected");
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
        {error && <p className="text-[8px] text-red-500">{error}</p>}
        {type === "xlsx" && sheetName && (
          <select
            id="sheetName"
            name="sheetName"
            onChange={onChangeSheet}
            className="nodrag mt-2 text-sm"
          >
            <option value="">Select the Sheet:</option>
            {sheetName?.map((file, index) => (
              <option key={index} value={file}>
                {file}
              </option>
            ))}
          </select>
        )}
        {selectedFile ? (
          type === "xlsx" ? (
            sheetName ? (
              <button
                className="bg-black text-white p-1 w-auto self-center mt-2 text-[10px]"
                onClick={handleExtract}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" /> Extracting...
                  </>
                ) : (
                  "Extract"
                )}
              </button>
            ) : (
              <button
                className="bg-black text-white p-1 w-auto self-center mt-2 text-[10px]"
                onClick={handleSheets}
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
            )
          ) : (
            <button
              className="bg-black text-white p-1 w-auto self-center mt-2 text-[10px]"
              onClick={handleExtract}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner" /> Extracting...
                </>
              ) : (
                "Extract"
              )}
            </button>
          )
        ) : null}
        <p className="text-[5px] text-center font-bold text-green-500">
          {status}
        </p>
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
