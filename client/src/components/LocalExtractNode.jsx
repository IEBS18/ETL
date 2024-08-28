import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

function LocalExtractNode({ id, data, isConnectable }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sheetName, setSheetName] = useState(null);
  const [sheet, setSheet] = useState('');

  const onChange = useCallback((evt) => {
    setSelectedFile(evt.target.files[0]);
  }, []);

  const onChangeSheet = useCallback((evt) => {
    console.log(evt.target.value);
    setSheet(evt.target.value);
  }, []);

  const handleDelete = () => {
    data.setNodes((nds) => nds.filter((node) => node.id !== id)); // Remove the node by its id
  };

  const handleSheets = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      // formData.append('sheet_name', 'Sheet1'); // Replace 'Sheet1' with the actual sheet name you want to extract columns from

      try {
        const response = await fetch('http://127.0.0.1:5000/localextract', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        console.log(data); // Handle the response data (e.g., display sheet names and columns)
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
      // formData.append('sheet_name', 'Sheet1'); // Replace 'Sheet1' with the actual sheet name you want to extract columns from

      try {
        const response = await fetch('http://127.0.0.1:5000/localextractsheet', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        console.log(data); // Handle the response data (e.g., display sheet names and columns)
        // setSheetName(data.sheet_names);
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
        {sheetName && (<select id="sheetName" name="sheetName" onChange={onChangeSheet} className='nodrag mt-2'>
          <option value="">Select the Sheet:</option>
          {sheetName?.map((file, index) => (
            <option key={index} value={file}>{file}</option>
          ))
          }
        </select>)}
        {sheetName ? (
          <button
          className='bg-black text-white p-2 w-auto self-center mt-4'
          onClick={handleExtract}
        >
          Extract
        </button>
        ):(
          <button
          className='bg-black text-white p-2 w-auto self-center mt-4'
          onClick={handleSheets}
        >
          Load Sheets
        </button>
          
        )}
        {/* <button
          className='bg-black text-white p-2 w-1/3 self-center mt-4'
          onClick={handleExtract}
        >
          Extract
        </button> */}
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

export default LocalExtractNode;
