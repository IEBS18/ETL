import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import SqlPopUp from '../pages/SqlPopUp';
import mysql from '../assets/export/mysql.png';

const handleStyle = { left: 10 };

function SQLExtractNode({ data, isConnectable }) {
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
        <label htmlFor="text">SQL Server</label>
        <input id="text" name="text" type='text' onChange={onChange} className="nodrag" />
        <Dialog>
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
        </Dialog>
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

export default SQLExtractNode;
