// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import { useCallback, useState, memo } from 'react';
// import { Handle, Position, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react';
// import SqlPopUp from '../pages/SqlPopUp';
// import mysql from '../assets/export/mysql.png';


// const handleStyle = { left: 10 };

// function LoadNode({ id, data, isConnectable }) {
//     const { updateNodeData } = useReactFlow();
//     const [filePath, setfilePath] = useState('');
//     const [query, setQuery] = useState('');
//     const connections = useHandleConnections({
//         type: 'target',
//     });
//     console.log('connections: ', connections)
//     const nodesData = useNodesData(connections.source);
//     console.log(nodesData?.id);

//     // const onChange = useCallback((evt) => {
//     //     console.log(evt.target.value);
//     //     setQuery(evt.target.value);
//     // }, []);

//     const handleDelete = () => {
//         data.setNodes((nds) => nds.filter((node) => node.id !== id)); // Remove the node by its id
//     };

//     const handleLoad = async () => {
//         console.log(data.filePath);
//         // setfilePath(data.filePath);
//         const payload = {
//             output_path: data.filePath,
//         };
    
//         try {
//             const response = await fetch('http://localhost:5000/downloadfroms3', {
//                 method: 'POST',
//                 headers: {
//                     'Access-Control-Allow-Origin': '*',
//                     'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(payload), // Convert the JSON object to a string
//             });

//             const blob = await response.blob();

//             // Create a URL for the file and trigger a download
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', 'output.csv'); // Filename to be downloaded
//             document.body.appendChild(link);
//             link.click();
        
//             // Clean up
//             document.body.removeChild(link);
//             window.URL.revokeObjectURL(url);

//         } catch (error) {
//             console.error(error);
//         }
//     };
    

//     return (
//         <div className="text-updater-node relative">
//             <Handle
//                 type="target"
//                 position={Position.Top}
//                 id="b"
//                 isConnectable={isConnectable}
//             />
//             <button
//                 onClick={handleDelete}
//                 className="absolute top-0 right-0 p-1 text-red-500"
//             >
//                 &times;
//             </button>
//             <div className='text-sm border-2 border-black w-full flex flex-col p-2'>
//                 <div>
//                     <p><strong>Source ID:</strong> {data.sourceId || 'N/A'}</p>
//                     <p><strong>File Path:</strong> {data.filePath || 'N/A'}</p>
//                 </div>
//                 {/* <label htmlFor="text">SQL Query:</label>
//                 <textarea id="text" name="text" type='text' onChange={onChange} className="nodrag" placeholder="SELECT * FROM TABLES;" /> */}
//                 <button className="bg-black text-white p-2 w-auto self-center mt-4" onClick={handleLoad}>
//                     Download
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default memo(LoadNode);


import { useCallback, useState, memo } from 'react';
import { Handle, Position, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react';
import '../index.css';

function LoadNode({ id, data, isConnectable }) {
    const { setNodes } = useReactFlow();
    const connections = useHandleConnections({
        type: 'target',
    });


    const handleDelete = () => {
        setNodes((nds) => nds.filter((node) => node.id !== id)); // Remove the node by its id
    };

    const handleLoad = async () => {
        const payload = {
            output_path: data.filePath,
        };
        console.log(data.filePath);

        try {
            const response = await fetch('http://localhost:5000/downloadfroms3', {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const blob = await response.blob();

            // Create a URL for the file and trigger a download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'output.csv'); // Filename to be downloaded
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div
            className={`relative p-1 dndnode ${data.isConnecting ? 'connecting' : ''}`} 
            style={{
                borderRadius: '10px', 
        // border: `2px solid ${data.isConnecting ? '#ff0071' : '#1a192b'}`,
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
                    {/* <p className='text-[10px]'><strong>Source ID:</strong> {data.sourceId || 'N/A'}</p>
                    <p className='text-[10px]'><strong>File Path:</strong> {data.filePath || 'N/A'}</p> */}
                    <p className="text-[10px] text-center font-bold text-black">Click on Download to get the Transformed File.</p>
                </div>
                <button
                    className="bg-black text-white p-1 w-auto self-center mt-2 text-[10px]"
                    onClick={handleLoad}
                >
                    Download
                </button>
            </div>
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

export default memo(LoadNode);
