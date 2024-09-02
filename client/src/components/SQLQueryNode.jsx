import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useCallback, useState } from 'react';
import { Handle, Position, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react';
import SqlPopUp from '../pages/SqlPopUp';
import mysql from '../assets/export/mysql.png';
import { useMemo, memo } from "react";

function SQLQueryNode({ id, data, isConnectable }) {
    const { setNodes } = useReactFlow();
    const [filePath, setFilePath] = useState('');
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);  // New state variable for loading

    const [status, setStatus]= useState('');

    const connections = useHandleConnections({
        type: 'target',
    });
    const nodesData = useNodesData(connections.source);

    const onChange = useCallback((evt) => {
        setQuery(evt.target.value);
    }, []);

    const handleDelete = () => {
        setNodes((nds) => nds.filter((node) => node.id !== id)); // Remove the node by its id
    };

    const handleTransform = async () => {
        setFilePath(data.filePath);
        setIsLoading(true);  // Set loading state to true

        const payload = {
            input_path: data.filePath,
            sql_query: query,
        };

        try {
            const response = await fetch('http://localhost:5000/run_sql_on_s3_csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload), 
            });

            const data = await response.json();
            setNodes((nds) =>
                nds.map((node) =>
                  node.id === id ? { ...node, data: { ...node.data, filePath: data.output_path } } : node
                )
            );
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false); 
            setStatus("SQL Query Executed, connect to Load.") // Set loading state to false once the process is complete
        }
    };

    return (
        <div
            className={`relative p-1 dndnode ${data.isConnecting ? 'connecting' : ''}`} 
            style={{
                borderRadius: '10px', 
                border: `2px solid ${data.isConnecting ? '#7cfc00' : '#1a192b'}`,
                width: '150px', 
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
                    {/* <p className="text-[10px]"><strong>Source ID:</strong> {data.sourceId || 'N/A'}</p>
                    <p className="text-[10px]"><strong>File Path:</strong> {data.filePath || 'N/A'}</p> */}
                    <p className="text-[10px] text-center font-bold text-black">Write your SQL Query to Transform.</p>
                </div>
                <label htmlFor="text"></label>
                <textarea
                    id="text"
                    name="text"
                    type='text'
                    onChange={onChange}
                    className="nodrag mt-2 text-[8px] p-1"
                    placeholder="SELECT * FROM TABLE;"
                />
                <button
                    className="bg-black text-white p-1 w-auto self-center mt-2 text-[10px]"
                    onClick={handleTransform}
                    disabled={isLoading}  // Disable button while loading
                >
                    {isLoading ? 'Transforming...' : 'Transform'}  {/* Change button text based on loading state */}
                </button>
                <p className='text-[5px] text-center font-bold text-green-500'>{status}</p>
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

export default memo(SQLQueryNode);
