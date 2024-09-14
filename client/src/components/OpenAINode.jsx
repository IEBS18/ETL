import { useCallback, useEffect, useState } from 'react';
import { Handle, Position, useNodesData, useReactFlow } from '@xyflow/react';
import { memo } from "react";

function OpenAINode({ id, data, isConnectable }) {
  const { setNodes } = useReactFlow();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [filePaths, setFilePaths] = useState(data.filePaths || []); // Initial filePaths from the node data

  // Collect file paths from data whenever it changes (to handle updates from other connected nodes)
  useEffect(() => {
    if (data.filePaths) {
      setFilePaths(data.filePaths);
    }
  }, [data.filePaths]);

  // Handle query input change
  const onChange = useCallback((evt) => {
    setQuery(evt.target.value);
  }, []);

  const handleDelete = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id)); // Remove the node by its id
  };

  // Handle transformation on multiple files
  const handleTransform = async () => {
    if (!query || filePaths.length === 0) {
      setStatus("Please provide a valid query and connect at least one file.");
      return;
    }

    setIsLoading(true);  // Set loading state to true

    const payload = {
      input_paths: filePaths,  // Send multiple file paths
      openai_query: query,
    };

    try {
      const response = await fetch('http://localhost:5000/run_openai_on_s3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), 
      });

      const data = await response.json();
      console.log(data);
      if (response.ok && data.output_path) {
        // Update the node with the new file path from the OpenAI transformation
        setNodes((nds) =>
          nds.map((node) =>
            node.id === id ? { ...node, data: { ...node.data, filePath: data.output_path } } : node
          )
        );
        setError("");
        setStatus("OpenAI Query Executed, connect to Load.");
      } else {
        throw new Error("OpenAI execution failed.");
      }
    } catch (error) {
      console.error(error);
      setStatus("");
      setError("Failed to execute OpenAI query.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`relative p-1 dndnode ${data.isConnecting ? 'connecting' : ''}`} 
      style={{
        borderRadius: '5px', 
        border: `2px solid ${data.isConnecting ? '#7cfc00' : '#1a192b'}`,
        width: '200px', 
        height: 'auto', 
        fontSize: '10px'
      }}
    >
      <button
        onClick={handleDelete}
        className="absolute top-0 right-0 p-1 text-red-500"
      >
        &times;
      </button>
      <div className='text-[10px] flex flex-col p-2'>
        <div>
          <p className="text-[10px] text-center font-bold text-black">Write your OpenAI Query to Transform.</p>
        </div>
        <label htmlFor="text"></label>
        <textarea
          id="text"
          name="text"
          type='text'
          onChange={onChange}
          className="nodrag mt-2 text-[8px] p-1"
          placeholder="Write OpenAI query..."
        />
        <button
          className="bg-black text-white p-1 w-auto self-center mt-2 text-[10px]"
          onClick={handleTransform}
        //   disabled={isLoading || filePaths.length === 0}  // Disable if no files or loading
        >
          {isLoading ? 'Transforming...' : 'Transform'}
        </button>
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
        style={{ right: '-4px', top: '50%', transform: 'translateY(-50%)' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="b"
        isConnectable={isConnectable}
        style={{ left: '-4px', top: '50%', transform: 'translateY(-50%)' }}
      />
    </div>
  );
}

export default memo(OpenAINode);
