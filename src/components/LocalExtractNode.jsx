import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

function LocalExtractNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node">
      <div className='text-sm border-2 border-black flex flex-col p-2'>
        <label htmlFor="file"></label>
        <input id="file" name="file" type='file' onChange={onChange} className="nodrag" />
        <button className='bg-black text-white p-2 w-1/3 self-center mt-4'>Extract</button>
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
