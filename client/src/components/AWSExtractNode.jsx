import React, { useState, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AwsPopUp from "../pages/AwsPopUp";
import awsS3 from "../assets/export/awsS3.png";

const handleStyle = { left: 10 };

function AWSExtractNode({ id, data, isConnectable }) {
  const [AwsData, setAwsData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  const onSave = (data) => {
    setAwsData(data);
  };

  const onPopUpOpen = () => {
    setIsDialogOpen(true);
  };

  const onPopUpClose = () => {
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    data.setNodes((nds) => nds.filter((node) => node.id !== id)); // Remove the node by its id
  };

  return (
    <div className="text-updater-node relative">
      {/* Cross Button */}
      <button
        onClick={handleDelete}
        className="absolute top-0 right-0 p-1 text-red-500"
      >
        &times;
      </button>
      <div className="text-sm border-2 border-black w-full flex flex-col p-2">
        <p>AWS</p>

        {AwsData ? (
          <div>
            <label htmlFor="fileSelect">Select File:</label>
            <select
              id="fileSelect"
              name="fileSelect"
              onChange={onChange}
              className="nodrag"
            >
              <option value="">Select a file</option>
              {AwsData?.objects?.filter(
                  (file) => file.endsWith(".csv") || file.endsWith(".xlsx")
                ).map((file, index) => (
                  <option key={index} value={file}>
                    {file}
                  </option>
                ))}
            </select>
          </div>
        ) : (
          <p>Loading files...</p> // You can show a loading message or spinner here
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button
              className="bg-black text-white p-2 w-auto self-center mt-4"
              onClick={onPopUpOpen}
            >
              {AwsData ? "Load Data" : "Connect Account"}
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <img src={awsS3} alt="awsS3" className="h-8 w-8" />
                <span>Connect AWS S3</span>
              </DialogTitle>
            </DialogHeader>
            <AwsPopUp onSave={onSave} closePopUp={onPopUpClose} />
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

export default AWSExtractNode;
