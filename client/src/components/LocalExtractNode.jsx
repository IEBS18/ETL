import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

function LocalExtractNode({ data, isConnectable }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const onChange = useCallback((evt) => {
    setSelectedFile(evt.target.files[0]);
  }, []);

  const handleExtract = async () => {
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
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('No file selected');
    }
  };

  return (
    <div className="text-updater-node">
      <div className='text-sm border-2 border-black flex flex-col p-2'>
        <label htmlFor="file">Upload File</label>
        <input
          id="file"
          name="file"
          type='file'
          onChange={onChange}
          className="nodrag"
        />
        <button
          className='bg-black text-white p-2 w-1/3 self-center mt-4'
          onClick={handleExtract}
        >
          Extract
        </button>
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
