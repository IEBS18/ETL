// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ChevronLeft } from "lucide-react";
// import Sidebar from "../Sidebar";
// import awsS3 from "../assets/export/awsS3.png";
// import mysql from "../assets/export/mysql.png";
// import file from "../assets/export/file.png";
// import script from "../assets/transform/script.png";
// import download from "../assets/load/download.png";

// import { useDnD } from "./DnDContext";

// export default function Component({ nodes, edges, setNodes, setEdges }) {
//   const generalItems = [
//     {
//       name: "Local",
//       icon: <img src={file} alt="file" className="h-4 w-4" />,
//       type: "LocalExtractor",
//     },
//     {
//       name: "Amazon S3",
//       icon: <img src={awsS3} alt="sql" className="h-4 w-4" />,
//       type: "AWSExtractor",
//     },
//     {
//       name: "SQL Server",
//       icon: <img src={mysql} alt="awsS3" className="h-4 w-4" />,
//       type: "SQLExtractor",
//     },
//   ];
//   const TransformItems = [
//     {
//       name: "SQL Query",
//       icon: <img src={script} alt="sql" className="h-4 w-4" />,
//       type: "SQLQuery",
//     },
//   ];
//   const LoadItems = [
//     {
//       name: "Download",
//       icon: <img src={download} alt="file" className="h-4 w-4" />,
//       type: "FileLoad",
//     },
//   ];

//   const [flowName, setFlowName] = useState("Untitled Pipeline");
//   const [savedFlows, setSavedFlows] = useState([]);
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   useEffect(() => {
//     // Load saved flows from localStorage when the component mounts
//     const storedFlows = JSON.parse(localStorage.getItem("savedFlows")) || [];
//     setSavedFlows(storedFlows);
//   }, []);

//   const handleSaveFlow = () => {
//     const currentFlow = {
//       name: flowName,
//       nodes,
//       edges,
//     };
//     const updatedFlows = [...savedFlows, currentFlow];
//     setSavedFlows(updatedFlows);
//     localStorage.setItem("savedFlows", JSON.stringify(updatedFlows));
//     alert(`Flow "${flowName}" saved successfully!`);
//   };

//   const handleRestoreFlow = (selectedFlow) => {
//     setFlowName(selectedFlow.name);
//     const restoredNodes = selectedFlow.nodes.map((node) => ({
//       ...node,
//       data: {
//         ...node.data,
//         setNodes, // Reassign the setNodes function
//       },
//     }));
//     setNodes(restoredNodes);
//     setEdges(selectedFlow.edges || []);
//     alert(`Flow "${selectedFlow.name}" restored!`);
//   };

//   const [_, setType] = useDnD();

//   const onDragStart = (event, nodeType) => {
//     setType(nodeType);
//     event.dataTransfer.effectAllowed = "move";
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <div className="flex flex-col bg-background">
//       <header className="flex items-center justify-between p-4 border-b">
//         <div className="flex items-center space-x-4">
//           <Button variant="ghost" size="icon">
//             <ChevronLeft className="h-4 w-4" />
//           </Button>
//           <div className="flex items-center space-x-2">
//             <span className="text-sm font-medium">Pipelines</span>
//             <span className="text-sm text-muted-foreground">&gt;</span>
//             <Input
//               className="h-8 w-40"
//               value={flowName}
//               onChange={(e) => setFlowName(e.target.value)}
//             />
//           </div>
//           <Button variant="ghost" size="sm" onClick={handleSaveFlow}>
//             Save
//           </Button>
//         </div>
//         <div className="flex items-center space-x-2">
//           {savedFlows.length > 0 ? (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="bg-green-500 text-white hover:bg-green-600"
//                 >
//                   Load Saved Pipelines
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-56">
//                 {savedFlows.map((flow, index) => (
//                   <DropdownMenuItem
//                     key={index}
//                     onClick={() => handleRestoreFlow(flow)}
//                   >
//                     {flow.name}
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           ) : (
//             <Button
//               variant="outline"
//               size="sm"
//               className="bg-green-500 text-white"
//               disabled
//             >
//               No Saved Pipelines
//             </Button>
//           )}
//         </div>
//       </header>
//       <Tabs defaultValue="extract" className="">
//         <TabsList className="bg-background border-b px-4">
//           <TabsTrigger value="extract">Extract</TabsTrigger>
//           <TabsTrigger value="transform">Transform</TabsTrigger>
//           <TabsTrigger value="load">Load</TabsTrigger>
//         </TabsList>
//         <TabsContent value="transform" className="p-4 bg-gray-50">
//           <div className="flex space-x-2">
//             {TransformItems.map((item) => (
//               <Button
//                 key={item.name}
//                 variant="outline"
//                 className="h-10 px-3 py-2"
//                 onDragStart={(event) => onDragStart(event, item.type)}
//                 draggable
//               >
//                 <span className="mr-2">{item.icon}</span>
//                 {item.name}
//               </Button>
//             ))}
//           </div>
//         </TabsContent>
//         <TabsContent value="load" className="p-4 bg-gray-50">
//           <div className="flex space-x-2">
//             {LoadItems.map((item) => (
//               <Button
//                 key={item.name}
//                 variant="outline"
//                 className="h-10 px-3 py-2"
//                 onDragStart={(event) => onDragStart(event, item.type)}
//                 draggable
//               >
//                 <span className="mr-2">{item.icon}</span>
//                 {item.name}
//               </Button>
//             ))}
//           </div>
//         </TabsContent>
//         <TabsContent value="extract" className="p-4 bg-gray-50">
//           <div className="flex space-x-2">
//             {generalItems.map((item) => (
//               <Button
//                 key={item.name}
//                 variant="outline"
//                 className="h-10 px-3 py-2"
//                 onDragStart={(event) => onDragStart(event, item.type)}
//                 draggable
//               >
//                 <span className="mr-2">{item.icon}</span>
//                 {item.name}
//               </Button>
//             ))}
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "../Sidebar";
import awsS3 from "../assets/export/awsS3.png";
import mysql from "../assets/export/mysql.png";
import file from "../assets/export/file.png";
import script from "../assets/transform/script.png";
import download from "../assets/load/download.png";

import { useDnD } from "./DnDContext";

export default function Component({ nodes, edges, setNodes, setEdges }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // State to toggle sidebar
  const [flowName, setFlowName] = useState("Untitled Pipeline");
  const [savedFlows, setSavedFlows] = useState([]);
  const [_, setType] = useDnD();

  const generalItems = [
    {
      name: "Local",
      icon: <img src={file} alt="file" className="h-4 w-4" />,
      type: "LocalExtractor",
    },
    {
      name: "Amazon S3",
      icon: <img src={awsS3} alt="sql" className="h-4 w-4" />,
      type: "AWSExtractor",
    },
    // {
    //   name: "SQL Server",
    //   icon: <img src={mysql} alt="awsS3" className="h-4 w-4" />,
    //   type: "SQLExtractor",
    // },
  ];

  const TransformItems = [
    {
      name: "SQL Query",
      icon: <img src={script} alt="sql" className="h-4 w-4" />,
      type: "SQLQuery",
    },
  ];

  const LoadItems = [
    {
      name: "Download",
      icon: <img src={download} alt="file" className="h-4 w-4" />,
      type: "FileLoad",
    },
  ];

  useEffect(() => {
    const storedFlows = JSON.parse(localStorage.getItem("savedFlows")) || [];
    setSavedFlows(storedFlows);
  }, []);

  const handleSaveFlow = () => {
    const currentFlow = {
      name: flowName,
      nodes,
      edges,
    };
    const updatedFlows = [...savedFlows, currentFlow];
    setSavedFlows(updatedFlows);
    localStorage.setItem("savedFlows", JSON.stringify(updatedFlows));
    alert(`Flow "${flowName}" saved successfully!`);
  };

  const handleRestoreFlow = (selectedFlow) => {
    setFlowName(selectedFlow.name);
    const restoredNodes = selectedFlow.nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        setNodes,
      },
    }));
    setNodes(restoredNodes);
    setEdges(selectedFlow.edges || []);
    alert(`Flow "${selectedFlow.name}" restored!`);
  };

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} />
      <div
        className="flex flex-col bg-background transition-all duration-300"
        style={{
          marginLeft: isSidebarOpen ? "50px" : "0px",
          width: isSidebarOpen ? "calc(100% - 50px)" : "calc(100% - 0px)",
        }}
      >
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {isSidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Pipelines</span>
              <span className="text-sm text-muted-foreground">&gt;</span>
              <Input
                className="h-8 w-40"
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="sm" onClick={handleSaveFlow}>
              Save
            </Button>
            {savedFlows.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-500 text-white hover:bg-green-600 hover:text-white"
                  >
                    Load Saved Pipelines
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {savedFlows.map((flow, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => handleRestoreFlow(flow)}
                    >
                      {flow.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="bg-green-500 text-white"
                disabled
              >
                No Saved Pipelines
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">UserX</span>
            <Button variant="ghost" size="sm">
              Log out
            </Button>
          </div>
        </header>
        <Tabs defaultValue="extract" className="">
          <TabsList className="bg-background border-b px-4">
            <TabsTrigger value="extract">Extract</TabsTrigger>
            <TabsTrigger value="transform">Transform</TabsTrigger>
            <TabsTrigger value="load">Load</TabsTrigger>
          </TabsList>
          <TabsContent value="transform" className="p-4 bg-gray-50">
            <div className="flex space-x-2">
              {TransformItems.map((item) => (
                <Button
                  key={item.name}
                  variant="outline"
                  className="h-10 px-3 py-2"
                  onDragStart={(event) => onDragStart(event, item.type)}
                  draggable
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="load" className="p-4 bg-gray-50">
            <div className="flex space-x-2">
              {LoadItems.map((item) => (
                <Button
                  key={item.name}
                  variant="outline"
                  className="h-10 px-3 py-2"
                  onDragStart={(event) => onDragStart(event, item.type)}
                  draggable
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="extract" className="p-4 bg-gray-50">
            <div className="flex space-x-2">
              {generalItems.map((item) => (
                <Button
                  key={item.name}
                  variant="outline"
                  className="h-10 px-3 py-2"
                  onDragStart={(event) => onDragStart(event, item.type)}
                  draggable
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
