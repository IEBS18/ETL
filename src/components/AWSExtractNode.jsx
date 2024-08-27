import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

function AWSExtractNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node">
      {/* <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      /> */}
      <div className='text-sm border-2 border-black w-full flex flex-col p-2'>
        <label htmlFor="text">AWS Bucket Key:</label>
        <input id="text" name="text" type='text' onChange={onChange} className="nodrag" />
        <button className='bg-black text-white p-2 w-auto self-center mt-4'>Connect Account</button>
      </div>
      {/* <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      /> */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default AWSExtractNode;
