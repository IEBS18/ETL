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

const handleStyle = { left: 10 };



function SQLQueryNode({ id, data, isConnectable }) {
    const { updateNodeData } = useReactFlow();
    const { setNodes } = useReactFlow();
    const [filePath, setfilePath] = useState('');
    const [query, setQuery] = useState('');
    const connections = useHandleConnections({
        type: 'target',
    });
    console.log('connections: ', connections)
    const nodesData = useNodesData(connections.source);
    console.log(nodesData?.id);

    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
        setQuery(evt.target.value);
    }, []);

    const handleDelete = () => {
        data.setNodes((nds) => nds.filter((node) => node.id !== id)); // Remove the node by its id
    };

    const handleTransform = async () => {
        console.log(data.filePath);
        setfilePath(data.filePath);
    
        // Create a JSON object instead of FormData
        const payload = {
            input_path: data.filePath,
            sql_query: query,
        };
    
        try {
            const response = await fetch('http://localhost:5000/run_sql_on_s3_csv', {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Content-Type': 'application/json',
                    // 'Access-Control-Allow-Credentials' : true,
                    // 'Access-Control-Allow-Methods': '*',
                    
                },
                body: JSON.stringify(payload), // Convert the JSON object to a string
            });
    
            const data = await response.json();
            console.log(data);
            console.log(data.output_path);
            setNodes((nds) =>
                nds.map((node) =>
                  node.id === id ? { ...node, data: { ...node.data, filePath: data.output_path } } : node
                )
              );
        } catch (error) {
            console.error(error);
        }
    };
    

    return (
        <div className="text-updater-node relative " >
            <Handle
                type="target"
                position={Position.Top}
                id="b"
                isConnectable={isConnectable}
            />
            <button
                onClick={handleDelete}
                className="absolute top-0 right-0 p-1 text-red-500"
            >
                &times;
            </button>
            <div className='text-sm border-2 border-black w-full flex flex-col p-2 pb-6'>
                <div>
                    <p><strong>Source ID:</strong> {data.sourceId || 'N/A'}</p>
                    <p><strong>File Path:</strong> {data.filePath || 'N/A'}</p>
                </div>
                <label htmlFor="text">SQL Query:</label>
                <textarea id="text" name="text" type='text' onChange={onChange} className="nodrag" placeholder="SELECT * FROM TABLE;" />
                <button className="bg-black text-white p-2 w-auto self-center mt-4" onClick={handleTransform}>
                    Transform
                </button>
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                id="c"
                isConnectable={isConnectable}
            />
        </div>
    );
}

export default memo(SQLQueryNode);
