
import { useCallback, useState, memo } from 'react';
import { Handle, useReactFlow } from '@xyflow/react';
import '../index.css';



function LoadNode({ id, data, isConnectable }) {
    const { setNodes } = useReactFlow();
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    const handleDelete = () => {
        setNodes((nds) => nds.filter((node) => node.id !== id)); // Remove the node by its id
    };

    const handleLoad = async () => {
        if (!data.filePath) {
            setError("File path not available. Please ensure the source node is connected.");
            return;
        }

        const payload = {
            output_path: data.filePath,
        };

        setStatus("Downloading...");
        setError(""); // Reset any previous errors

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/downloadfroms3`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Failed to download file: ${response.statusText}`);
            }

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

            setStatus("Download successful!");
        } catch (error) {
            console.error(error);
            setError(`Error: ${error.message}`);
            setStatus("Download failed.");
        }
    };

    return (
        <div
            className={`relative p-1 dndnode ${data.isConnecting ? 'connecting' : ''}`} 
            style={{
                borderRadius: '5px', 
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
                    <p className="text-[10px] text-center font-bold text-black">Click on Download to get the Transformed File.</p>
                </div>
                <button
                    className="bg-black text-white p-1 w-auto self-center mt-2 text-[10px]"
                    onClick={handleLoad}
                >
                    Download
                </button>
                {status && <p className="text-green-500 text-center text-[8px] mt-2">{status}</p>}
                {error && <p className="text-red-500 text-center text-[8px] mt-2">{error}</p>}
            </div>
            <Handle
                type="target"
                position="left"
                id="b"
                isConnectable={isConnectable}
                style={{ left: '-4px', top: '50%', transform: 'translateY(-50%)' }}
            />
        </div>
    );
}

export default memo(LoadNode);
