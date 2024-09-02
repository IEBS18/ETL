import { useCallback, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import '../index.css';
import { memo } from 'react';

function LocalExtractNode({ id, data, isConnectable }) {
  const [status, setStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [sheetName, setSheetName] = useState(null);
  const [sheet, setSheet] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state to manage loading
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
      setIsLoading(true); // Set loading to true
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
      } finally {
        setIsLoading(false); // Set loading to false once request is done
      }
    } else {
      console.error('No file selected');
    }
  };

  const handleExtract = async () => {
    if (selectedFile) {
      setIsLoading(true); // Set loading to true
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
      } finally {
        setIsLoading(false); // Set loading to false once request is done
        setStatus("File Extracted, please connect to transform.");
      }
    } else {
      console.error('No file selected');
    }
  };

  return (
    <div className={`relative p-1 dndnode ${data.isConnecting ? 'connecting' : ''}`} 
      style={{
        borderRadius: '10px', 
        border: `2px solid ${data.isConnecting ? '#7cfc00' : '#1a192b'}`,
        width: '150px', 
        height: 'auto', 
        fontSize: '10px'
      }}>
      <button
        onClick={handleDelete}
        className="absolute top-0 right-0 p-1 text-red-500"
      >
        &times;
      </button>
      <div className='text-[10px] flex flex-col p-2'>
        <label htmlFor="file" className="text-[10px] text-center font-bold text-black">Upload File</label>
        <input
          id="file"
          name="file"
          type='file'
          onChange={onChange}
          className="nodrag mt-2 text-[8px]"
        />
        {sheetName && selectedFile.name.endsWith('.xlsx') && (
          <select id="sheetName" name="sheetName" onChange={onChangeSheet} className='nodrag mt-2 text-sm'>
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
                className='bg-black text-white p-1 w-auto self-center mt-2 text-[10px]'
                onClick={handleExtract}
                disabled={isLoading} // Disable button during loading
              >
                {isLoading ? (
                  <>
                    <span className="spinner" /> Extracting...
                  </>
                ) : (
                  'Extract'
                )}
              </button>
            ) : (
              <button
                className='bg-black text-white p-1 w-auto self-center mt-2 text-[10px]'
                onClick={handleSheets}
                disabled={isLoading} // Disable button during loading
              >
                {isLoading ? (
                  <>
                    <span className="spinner" /> Loading Sheets...
                  </>
                ) : (
                  'Load Sheets'
                )}
              </button>
            )
          ) : (
            <button
              className='bg-black text-white p-1 w-auto self-center mt-2 text-[10px]'
              onClick={handleExtract}
              disabled={isLoading} // Disable button during loading
            >
              {isLoading ? (
                <>
                  <span className="spinner" /> Extracting...
                </>
              ) : (
                'Extract'
              )}
            </button>
          )
        ) : null}
        <p className='text-[5px] text-center font-bold text-green-500'>{status}</p>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
        style={{ right: '-4px', top: '50%', transform: 'translateY(-50%)' }}
      />
    </div>
  );
}

export default memo(LocalExtractNode);
