// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { useCallback, useEffect, useState } from "react";
// import { Handle, Position, useReactFlow } from "@xyflow/react";
// import AwsPopUp from "../pages/AwsPopUp";
// import awsS3 from "../assets/export/awsS3.png";
// const handleStyle = { left: 10 };

// function AWSExtractNode({id, data, isConnectable }) {
//   const [AwsData, setAwsData] = useState(null);
//   const [fileUpload, setFileUpload] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const { setNodes } = useReactFlow();
//   const onChange = useCallback((evt) => {
//     console.log(evt.target.value);
//   }, []);

//   const onSave = (data) => {
//     setAwsData(data);
//   };

//   const onSaveForm = (data) => {
//     setFormData(data);
//   };

//   const onPopUpOpen = () => {
//     setIsDialogOpen(true);
//   };

//   const onPopUpClose = () => {
//     setIsDialogOpen(false);
//   };

//   const handleSelectedFile = (evt) => {
//     setSelectedFile(evt.target.value);
//     setFileUpload(false);
//   };

//   const UploadToS3 = async (e) => {
//     e.preventDefault();
//     if (!selectedFile) {
//       alert("Please select a file first!");
//       return;
//     }

//     try {
//       const response = await fetch("http://127.0.0.1:5000/upload-to-s3", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ ...formData, filePath: selectedFile }),
//       });

//       if (response.ok) {
//         data = await response.json();
//         console.log("Data:", data);
//         // alert("File uploaded successfully!");
//         setFileUpload(true);
//         setNodes((nds) => 
//           nds.map((node) => 
//             node.id === id ? { ...node, data: { ...node.data, filePath: data.filePath } } : node
//           )
//         );
//       } else {
//         const errorData = await response.json();
//         alert(`Failed to upload file: ${errorData.error}`);
//       }
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       alert("An error occurred during the upload.");
//     }
//   };

//   const handleDelete = () => {
//     data.setNodes((nds) => nds.filter((node) => node.id !== id)); // Remove the node by its id
//   };

//   // Filter and build tree structure
//   const buildFilteredTree = (paths) => {
//     const tree = {};

//     // Filter paths for .csv or .xlsx files
//     const filteredPaths = paths.filter(
//       (path) => path.endsWith(".csv") || path.endsWith(".xlsx")
//     );

//     // Build tree
//     filteredPaths.forEach((path) => {
//       const parts = path.split("/");
//       let current = tree;

//       parts.forEach((part, index) => {
//         if (index === parts.length - 1) {
//           // It's a file
//           current[part] = null;
//         } else {
//           // It's a folder
//           if (!current[part]) {
//             current[part] = {};
//           }
//           current = current[part];
//         }
//       });
//     });

//     // Prune empty folders
//     const pruneEmptyFolders = (node) => {
//       for (const key in node) {
//         if (node[key] === null) continue; // It's a file, keep it
//         pruneEmptyFolders(node[key]);
//         if (Object.keys(node[key]).length === 0) {
//           delete node[key];
//         }
//       }
//     };

//     pruneEmptyFolders(tree);
//     return tree;
//   };

//   const renderOptions = (tree, prefix = "") => {
//     return Object.entries(tree).map(([key, value]) => {
//       const currentPath = `${prefix}${key}`;
//       if (value === null) {
//         return (
//           <option key={currentPath} value={currentPath}>
//             {currentPath}
//           </option>
//         );
//       } else {
//         return [
//           <option key={currentPath} disabled>
//             {currentPath}/
//           </option>,
//           ...renderOptions(value, `${currentPath}/`),
//         ];
//       }
//     });
//   };

//   return (
//     <div className="text-updater-node relative">
//       <button
//         onClick={handleDelete}
//         className="absolute top-0 right-0 p-1 text-red-500"
//       >
//         &times;
//       </button>
//       <div className="text-updater-node">
//         {/* <Handle
//         type="target"
//         position={Position.Top}
//         isConnectable={isConnectable}
//       /> */}
//         <div className="text-sm border-2 border-black w-full flex flex-col p-2">
//           <p>AWS</p>

//           {AwsData ? (
//             <div>
//               <label htmlFor="fileSelect">Select File:</label>
//               <select
//                 id="fileSelect"
//                 name="fileSelect"
//                 onChange={handleSelectedFile}
//                 className="nodrag"
//               >
//                 <option value="">Select a file</option>
//                 {renderOptions(buildFilteredTree(AwsData.objects))}
//               </select>
//             </div>
//           ) : (
//             <p>Loading files...</p>
//           )}
//           {/* <label htmlFor="text">AWS Bucket Key:</label> */}
//           {/* <input
//           id="text"
//           name="text"
//           type="text"
//           onChange={onChange}
//           className="nodrag"
//         /> */}

//           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//             <DialogTrigger asChild>
//               {AwsData ? (
//                 <button
//                   className="bg-black text-white p-2 w-auto self-center mt-4"
//                   onClick={UploadToS3}
//                   disabled={fileUpload}
//                 >
//                   {fileUpload ? "File's been Uploaded" : "Upload File"}
//                 </button>
//               ) : (
//                 <button
//                   className="bg-black text-white p-2 w-auto self-center mt-4"
//                   onClick={onPopUpOpen}
//                 >
//                   {AwsData ? "Load File" : "Connect Account"}
//                 </button>
//               )}

//               {/* <button
//               className={`p-2 w-auto self-center mt-4 ${
//                 AwsData === null
//                   ? "bg-gray-500 cursor-not-allowed"
//                   : "bg-black text-white"
//               }`}
//               disabled={AwsData === null}
//             >
//               Connect Account
//             </button> */}
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px]">
//               <DialogHeader>
//                 <DialogTitle className="flex items-center space-x-2">
//                   <img src={awsS3} alt="awsS3" className="h-8 w-8" />
//                   <span>Connect AWS S3</span>
//                 </DialogTitle>
//               </DialogHeader>
//               <AwsPopUp
//                 onSave={onSave}
//                 closePopUp={onPopUpClose}
//                 onSaveForm={onSaveForm}
//               />
//             </DialogContent>
//           </Dialog>
//         </div>
//         {/* <Handle
//         type="source"
//         position={Position.Bottom}
//         id="a"
//         style={handleStyle}
//         isConnectable={isConnectable}
//       /> */}
//         <Handle
//           type="source"
//           position={Position.Bottom}
//           id="b"
//           isConnectable={isConnectable}
//         />
//       </div>
//     </div>
//   );
// }

// export default AWSExtractNode;


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCallback, useState, memo } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import AwsPopUp from "../pages/AwsPopUp";
import awsS3 from "../assets/export/awsS3.png";

const handleStyle = { left: 10 };

function AWSExtractNode({ id, data, isConnectable }) {
  const [AwsData, setAwsData] = useState(null);
  const [fileUpload, setFileUpload] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const onSave = (data) => {
    setAwsData(data);
  };

  const onSaveForm = (data) => {
    setFormData(data);
  };

  const onPopUpOpen = () => {
    setIsDialogOpen(true);
  };

  const onPopUpClose = () => {
    setIsDialogOpen(false);
  };

  const handleSelectedFile = (evt) => {
    setSelectedFile(evt.target.value);
    setFileUpload(false);
  };

  const UploadToS3 = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/upload-to-s3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, filePath: selectedFile }),
      });

      if (response.ok) {
        const data = await response.json();
        setFileUpload(true);
        setNodes((nds) =>
          nds.map((node) =>
            node.id === id ? { ...node, data: { ...node.data, filePath: data.filePath } } : node
          )
        );
      } else {
        const errorData = await response.json();
        alert(`Failed to upload file: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred during the upload.");
    }
  };

  const handleDelete = () => {
    data.setNodes((nds) => nds.filter((node) => node.id !== id)); // Remove the node by its id
  };

  // Filter and build tree structure
  const buildFilteredTree = (paths) => {
    const tree = {};

    // Filter paths for .csv or .xlsx files
    const filteredPaths = paths.filter(
      (path) => path.endsWith(".csv") || path.endsWith(".xlsx")
    );

    // Build tree
    filteredPaths.forEach((path) => {
      const parts = path.split("/");
      let current = tree;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // It's a file
          current[part] = null;
        } else {
          // It's a folder
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
      });
    });

    // Prune empty folders
    const pruneEmptyFolders = (node) => {
      for (const key in node) {
        if (node[key] === null) continue; // It's a file, keep it
        pruneEmptyFolders(node[key]);
        if (Object.keys(node[key]).length === 0) {
          delete node[key];
        }
      }
    };

    pruneEmptyFolders(tree);
    return tree;
  };

  const renderOptions = (tree, prefix = "") => {
    return Object.entries(tree).map(([key, value]) => {
      const currentPath = `${prefix}${key}`;
      if (value === null) {
        return (
          <option key={currentPath} value={currentPath}>
            {currentPath}
          </option>
        );
      } else {
        return [
          <option key={currentPath} disabled>
            {currentPath}/
          </option>,
          ...renderOptions(value, `${currentPath}/`),
        ];
      }
    });
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
        fontSize: '10px',
      }}
    >
      <button
        onClick={handleDelete}
        className="absolute top-0 right-0 p-1 text-red-500"
      >
        &times;
      </button>
      <div className="text-updater-node">
        <div className="text-sm w-full flex flex-col p-2 ">
          <p className="text-[10px]">AWS</p>

          {AwsData ? (
            <div>
              <label htmlFor="fileSelect">Select File:</label>
              <select
                id="fileSelect"
                name="fileSelect"
                onChange={handleSelectedFile}
                className="nodrag text-[10px] width-[150px]"
                style={{ width: '120px' }}
              >
                <option value="">Select a file</option>
                {renderOptions(buildFilteredTree(AwsData.objects))}
              </select>
            </div>
          ) : (
            <p className="text-[10px]">Loading files...</p>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              {AwsData ? (
                <button
                  className="bg-black text-white w-auto p-1 self-center mt-2 text-[10px]"
                  onClick={UploadToS3}
                  disabled={fileUpload}
                >
                  {fileUpload ? "File's been Uploaded" : "Upload File"}
                </button>
              ) : (
                <button
                  className="bg-black text-white p-1 w-auto self-center mt-2 text-[10px]"
                  onClick={onPopUpOpen}
                >
                  {AwsData ? "Load File" : "Connect Account"}
                </button>
              )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <img src={awsS3} alt="awsS3" className="h-8 w-8" />
                  <span>Connect AWS S3</span>
                </DialogTitle>
              </DialogHeader>
              <AwsPopUp
                onSave={onSave}
                closePopUp={onPopUpClose}
                onSaveForm={onSaveForm}
              />
            </DialogContent>
          </Dialog>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          id="b"
          isConnectable={isConnectable}
        />
      </div>
    </div>
  );
}

export default memo(AWSExtractNode);
