import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCallback, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import AwsPopUp from "../pages/AwsPopUp";
import awsS3 from "../assets/export/awsS3.png";
const handleStyle = { left: 10 };

function AWSExtractNode({ data, isConnectable }) {
  // const [showPopup, setShowPopup] = useState(false);
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  // const handleButtonClick =() => {
  //   setShowPopup(true);
  // }

  // const handleClosePopup = () => {
  //   setShowPopup(false);
  // }

  return (
    <div className="text-updater-node">
      {/* <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      /> */}
      <div className="text-sm border-2 border-black w-full flex flex-col p-2">
        <label htmlFor="text">AWS Bucket Key:</label>
        <input
          id="text"
          name="text"
          type="text"
          onChange={onChange}
          className="nodrag"
        />
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-black text-white p-2 w-auto self-center mt-4">
              Connect Account
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
              <img src={awsS3} alt="awsS3" className="h-8 w-8" />
              <span>Connect AWS S3</span>
              </DialogTitle>
            </DialogHeader>
            <AwsPopUp />
          </DialogContent>
        </Dialog>
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
