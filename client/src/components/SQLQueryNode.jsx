import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useCallback } from 'react';
import { Handle, Position, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react';
import SqlPopUp from '../pages/SqlPopUp';
import mysql from '../assets/export/mysql.png';

const handleStyle = { left: 10 };

function SQLQueryNode({ id, data, isConnectable }) {
    const { updateNodeData } = useReactFlow();
    const connections = useHandleConnections({
        type: 'target',
    });
    console.log('connections: ', connections)
    const nodesData = useNodesData(connections.source);
    console.log(nodesData?.id);

    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);

    const handleDelete = () => {
        data.setNodes((nds) => nds.filter((node) => node.id !== id)); // Remove the node by its id
    };

    return (
        <div className="text-updater-node relative">
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
            <div className='text-sm border-2 border-black w-full flex flex-col p-2'>
                <div>
                <p><strong>Source ID:</strong> {data.sourceId || 'N/A'}</p>
                <p><strong>File Path:</strong> {data.filePath || 'N/A'}</p>
                </div>
                <label htmlFor="text">SQL Query:</label>
                <textarea id="text" name="text" type='text' onChange={onChange} className="nodrag" placeholder="SELECT * FROM TABLES;" />
                <button className="bg-black text-white p-2 w-auto self-center mt-4">
                    Transform
                </button>
                {/* <Dialog>
                    <DialogTrigger asChild>
                        <button className="bg-black text-white p-2 w-auto self-center mt-4">
                            Connect Account
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                                <img src={mysql} alt="mysql" className="h-8 w-8" />
                                <span>Connect MySql Server</span>
                            </DialogTitle>
                        </DialogHeader>
                        <SqlPopUp />
                    </DialogContent>
                </Dialog> */}
            </div>
            <Handle
                type="target"
                position={Position.Top}
                id="b"
                isConnectable={isConnectable}
            />
        </div>
    );
}

export default SQLQueryNode;
