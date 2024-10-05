import { useCallback, useState, memo } from 'react';
import { Handle, useReactFlow } from '@xyflow/react';
import '../index.css';
import { Button } from './ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

function ViewNode({ id, data, isConnectable }) {
    const { setNodes } = useReactFlow();
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [tableData, setTableData] = useState(null); // State to store table data
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleDelete = () => {
        setNodes((nds) => nds.filter((node) => node.id !== id)); // Remove the node by its id
    };

    const Table = ({ data }) => {
        if (!data || !data.first_fifty_rows || !data.columns) return <p>No data available</p>;

        return (
            <div className="overflow-auto max-h-[300px]"> {/* Make table scrollable */}
                <table className="min-w-full bg-white text-left">
                    <thead>
                        <tr>
                            {data.columns.map((col, index) => (
                                <th key={index} className="py-2 px-4 border sticky top-0 bg-gray-700 text-white">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.first_fifty_rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {data.columns.map((col, colIndex) => (
                                    <td key={colIndex} className="py-2 px-4 border">{row[col]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const handleView = async () => {
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/viewdata`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Failed to download file: ${response.statusText}`);
            }
            const responsedata = await response.json();
            console.log("Response data:", responsedata);
            setTableData(responsedata);
            setIsDrawerOpen(true);
            setStatus("Data Received");
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
                    <p className="text-[10px] text-center font-bold text-black">Connect Transformed File after Transformation.</p>
                </div>
                <button
                    className="bg-black text-white p-1 w-auto self-center mt-2 text-[10px]"
                    onClick={handleView}
                >
                    View
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
            <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className=''>
                <DrawerContent className="h-[70vh]"> {/* Set height to half the screen */}
                    <DrawerHeader className='flex flex-row justify-between'>
                        <DrawerTitle>Your Transformed Data(First 50 records only).</DrawerTitle>
                        <DrawerClose asChild>
                            <Button className='bg-red-600'>Cancel</Button>
                        </DrawerClose>
                    </DrawerHeader>
                    <div>
                        {tableData ? (
                            <Table data={tableData} />
                        ) : (
                            <p>No data available</p>
                        )}
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}

export default memo(ViewNode);
