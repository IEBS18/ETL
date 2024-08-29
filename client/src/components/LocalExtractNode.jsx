import { useCallback, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';


const controlStyle = {
  background: 'transparent',
  border: 'none',
};
const handleStyle = { left: 10 };

function LocalExtractNode({ id, data, isConnectable }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sheetName, setSheetName] = useState(null);
  const [sheet, setSheet] = useState('');

  const { updateNodeData } = useReactFlow();

  const { setNodes } = useReactFlow();

  const onChange = useCallback((evt) => {
    const file = evt.target.files[0];
    setSelectedFile(file);

    // Reset sheet names and sheet selection if a new file is selected
    setSheetName(null);
    setSheet('');

    if (file && file.name.endsWith('.csv')) {
      // Directly call handleExtract for .csv files
      handleExtract();
    }
  }, []);

  const onChangeSheet = useCallback((evt) => {
    setSheet(evt.target.value);
  }, []);

  const handleDelete = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id)); // Remove the node by its id
  };

  const handleSheets = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await fetch('http://127.0.0.1:5000/localextract', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setSheetName(data.sheet_names);
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('No file selected');
    }
  };

  const handleExtract = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('sheetName', sheet);

      try {
        const response = await fetch('http://127.0.0.1:5000/localextractsheet', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setNodes((nds) =>
          nds.map((node) =>
            node.id === id ? { ...node, data: { ...node.data, filePath: data.s3_path } } : node
          )
        );
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('No file selected');
    }
  };

  return (
    <div className="text-updater-node relative">
      <button
        onClick={handleDelete}
        className="absolute top-0 right-0 p-1 text-red-500"
      >
        &times;
      </button>
      <div className='text-sm border-2 border-black flex flex-col p-2'>
        <label htmlFor="file">Upload File</label>
        <input
          id="file"
          name="file"
          type='file'
          onChange={onChange}
          className="nodrag mt-2"
        />
        {sheetName && selectedFile.name.endsWith('.xlsx') && (
          <select id="sheetName" name="sheetName" onChange={onChangeSheet} className='nodrag mt-2'>
            <option value="">Select the Sheet:</option>
            {sheetName?.map((file, index) => (
              <option key={index} value={file}>{file}</option>
            ))}
          </select>
        )}
        {selectedFile ? (
          selectedFile.name.endsWith('.xlsx') ? (
            sheetName ? (
              <button
                className='bg-black text-white p-2 w-auto self-center mt-4'
                onClick={handleExtract}
              >
                Extract
              </button>
            ) : (
              <button
                className='bg-black text-white p-2 w-auto self-center mt-4'
                onClick={handleSheets}
              >
                Load Sheets
              </button>
            )
          ) : (
            <button
              className='bg-black text-white p-2 w-auto self-center mt-4'
              onClick={handleExtract}
            >
              Extract
            </button>
          )
        ) : null}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
}
function ResizeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="#ff0071"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: 'absolute', right: 5, bottom: 5 }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="16 20 20 20 20 16" />
      <line x1="14" y1="14" x2="20" y2="20" />
      <polyline points="8 4 4 4 4 8" />
      <line x1="4" y1="4" x2="10" y2="10" />
    </svg>
  );
}
export default LocalExtractNode;
