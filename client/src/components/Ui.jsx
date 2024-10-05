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
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import Sidebar from "../pages/Layout/Sidebar";
import awsS3 from "../assets/export/awsS3.png";
import mysql from "../assets/export/mysql.png";
import file from "../assets/export/file.png";
import script from "../assets/transform/script.png";
import download from "../assets/load/download.png";
import mongodb from "../assets/export/mongodb.png";
import csv from "../assets/export/csv.png";
import json from "../assets/export/json.png";
import postgresql from "../assets/export/postgresql.png";
import xlxs from "../assets/export/xlxs.png";
import xml from "../assets/export/xml.png";
import mssql from "../assets/export/mssql.png";
import logo from "../assets/MineX.png";
import gpt from "../assets/transform/gpt.png";
import meta from "../assets/transform/meta.png";
import python from "../assets/transform/python.png";
import r from "../assets/transform/r.png";
import perplexcity from "../assets/transform/perplexcity.png";
import view from "../assets/load/view.png";
import cassandra from "../assets/export/cassandra.png";
import redshift from "../assets/export/redshift.png";
import ftp from "../assets/export/ftp.png";
import { useDnD } from "./DnDContext";

export default function Component({ nodes, edges, setNodes, setEdges }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // State to toggle sidebar
  const [flowName, setFlowName] = useState("");
  const [savedFlows, setSavedFlows] = useState([]);
  const [_, setType] = useDnD();

  const generalItems = [
    // {
    //   name: "Local",
    //   icon: <img src={file} alt="file" className="h-4 w-4" />,
    //   type: "LocalExtractor",
    // },
    {
      name: "CSV",
      icon: <img src={csv} alt="csv" className="h-8 w-8" />,
      type: "CSVExtract",
    },
    {
      name: "XLXS",
      icon: <img src={xlxs} alt="xlxs" className="h-8 w-8" />,
      type: "XLXSExtract",
    },
    {
      name: "JSON",
      icon: <img src={json} alt="json" className="h-8 w-8" />,
      type: "JSONExtract",
    },
    {
      name: "XML",
      icon: <img src={xml} alt="xml" className="h-8 w-8" />,
      type: "XMLExtract",
    },
    {
      name: "Amazon S3",
      icon: <img src={awsS3} alt="sql" className="h-8 w-8" />,
      type: "AWSExtractor",
    },
    {
      name: "Cassandra",
      icon: <img src={cassandra} alt="cassandra" className="h-8 w-8" />,
      type: "SQLExtractor",
      premium: true,
    },
    {
      name: "FTP",
      icon: <img src={ftp} alt="ftp" className="h-8 w-8" />,
      type: "LocalExtractor",
      premium: true,
    },
    {
      name: "Redshift",
      icon: <img src={redshift} alt="redshift" className="h-8 w-8" />,
      type: "LocalExtractor",
      premium: true,
    },
    {
      name: "SQL Server",
      icon: <img src={mysql} alt="awsS3" className="h-8 w-8" />,
      type: "SQLExtractor",
      premium: true,
    },
    {
      name: "MS SQL",
      icon: <img src={mssql} alt="mssql" className="h-8 w-8" />,
      type: "LocalExtractor",
      premium: true,
    },
    {
      name: "PostgreSQL",
      icon: <img src={postgresql} alt="postgresql" className="h-8 w-8" />,
      type: "SQLExtractor",
      premium: true,
    },
    {
      name: "MongoDB",
      icon: <img src={mongodb} alt="mongodb" className="h-8 w-8" />,
      type: "LocalExtractor",
      premium: true,
    },
  ];

  const TransformItems = [
    {
      name: "SQL Query",
      icon: <img src={script} alt="sql" className="h-8 w-8" />,
      type: "SQLQuery",
    },
    {
      name: "Python",
      icon: <img src={python} alt="python" className="h-8 w-8" />,
      type: "SQLQuery",
      premium: true,
    },
    {
      name: "R",
      icon: <img src={r} alt="r" className="h-8 w-8" />,
      type: "SQLQuery",
      premium: true,
    },
    {
      name: "OpenAI",
      icon: <img src={gpt} alt="gpt" className="h-8 w-8" />,
      type: "OpenAIQuery",
      premium: false,
    },
    {
      name: "Llama",
      icon: <img src={meta} alt="meta" className="h-8 w-8" />,
      type: "SQLQuery",
      premium: true,
    },
    {
      name: "Perplexcity",
      icon: <img src={perplexcity} alt="perplexcity" className="h-8 w-8" />,
      type: "SQLQuery",
      premium: true,
    },
  ];

  const LoadItems = [
    {
      name: "Download",
      icon: <img src={download} alt="download" className="h-8 w-8" />,
      type: "FileLoad",
    },
    {
      name: "View",
      icon: <img src={view} alt="view" className="h-8 w-8" />,
      type: "ViewNode",
      // premium: true,
    },
    {
      name: "Amazon S3",
      icon: <img src={awsS3} alt="sql" className="h-8 w-8" />,
      type: "AWSExtractor",
      premium: true,
    },
    {
      name: "Cassandra",
      icon: <img src={cassandra} alt="cassandra" className="h-8 w-8" />,
      type: "SQLExtractor",
      premium: true,
    },
    {
      name: "Redshift",
      icon: <img src={redshift} alt="redshift" className="h-8 w-8" />,
      type: "LocalExtractor",
      premium: true,
    },
    {
      name: "SQL Server",
      icon: <img src={mysql} alt="awsS3" className="h-8 w-8" />,
      type: "SQLExtractor",
      premium: true,
    },
    {
      name: "MS SQL",
      icon: <img src={mssql} alt="mssql" className="h-8 w-8" />,
      type: "LocalExtractor",
      premium: true,
    },
    {
      name: "PostgreSQL",
      icon: <img src={postgresql} alt="postgresql" className="h-8 w-8" />,
      type: "SQLExtractor",
      premium: true,
    },
    {
      name: "MongoDB",
      icon: <img src={mongodb} alt="mongodb" className="h-8 w-8" />,
      type: "LocalExtractor",
      premium: true,
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
    alert(`Pipeline "${flowName}" saved successfully!`);
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
    alert(`Pipeline "${selectedFlow.name}" restored!`);
  };

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const renderButton = (item) => (
    <div className="relative">
      <Button
        key={item.name}
        variant="outline"
        className={`min-w-20 h-15 px-3 py-2 flex flex-col items-center text-[10px] font-bold ${item.premium ? "cursor-not-allowed" : ""
          }`}
        onDragStart={
          item.premium ? null : (event) => onDragStart(event, item.type)
        }
        draggable={!item.premium}
      >
        <span className="mx-auto">{item.icon}</span>
        {item.name}
      </Button>
      {item.premium && (
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 backdrop-blur-[1px] flex items-center justify-center">
          <Lock className="text-black-700 h-4 w-4 font-bold" />
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* <Sidebar isOpen={isSidebarOpen} /> */}
      <div
        className="flex flex-col w-full bg-background transition-all duration-300"
        // style={{
        //   marginLeft: isSidebarOpen ? "240px" : "0px",
        //   width: isSidebarOpen ? "calc(100% - 50px)" : "calc(100% - 0px)",
        // }}
      >
        {/* <header className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {isSidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <div className="flex items-center space-x-2">
              <img src={logo} className="w-30 h-[25px]" />
              <span className="text-sm font-medium">Pipelines</span>
              <span className="text-sm text-muted-foreground">&gt;</span>
              <Input
                className="h-8 w-40"
                value={flowName}
                placeholder="Untitled Pipeline"
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
                    Existing Pipelines
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
            <span className="text-sm font-medium">Welcome! IEBS1</span>
            <Button variant="ghost" size="sm">
              Log out
            </Button>
          </div>
        </header> */}
        {/* <header className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center space-x-4"> */}
            {/* Left section: Arrow button and logo */}
            {/* <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {isSidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button> */}
            {/* <img src={logo} className="w-30 h-[25px]" />
          </div> */}

          {/* Center section: Pipeline input and save button */}
          {/* <div className="flex-1 flex items-center justify-center space-x-2">
            <span className="text-sm font-medium">Pipelines</span>
            <span className="text-sm text-muted-foreground">&gt;</span>
            <Input
              className="h-8 w-40"
              value={flowName}
              placeholder="Untitled Pipeline"
              onChange={(e) => setFlowName(e.target.value)}
            />
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
                    Existing Pipelines
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
          </div> */}

          {/* Right section: Welcome message and logout button */}
          {/* <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Welcome! IEBS1</span>
            <Button variant="ghost" size="sm">
              Log out
            </Button>
          </div>
        </header> */}
        <Tabs defaultValue="extract" className="bg-white border-b">
          <TabsList className="bg-transparent w-full justify-between">
            <div className="flex items-center justify-between mx-4 mt-2">
              <div className="flex items-center mr-[280px]">
                <TabsTrigger value="extract">Data Source</TabsTrigger>
                <TabsTrigger value="transform">Transform</TabsTrigger>
                <TabsTrigger value="load">Load</TabsTrigger>
              </div>
              <div className="flex-1 flex items-center justify-center space-x-2 ml-40">
                <span className="text-sm font-medium">Pipelines</span>
                <span className="text-sm text-muted-foreground">&gt;</span>
                <Input
                  className="h-8 w-40"
                  value={flowName}
                  placeholder="Untitled Pipeline"
                  onChange={(e) => setFlowName(e.target.value)}
                />
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
                        Existing Pipelines
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
            </div>
          </TabsList>
          <TabsContent value="extract" className="p-4">
            <div className="flex space-x-2">
              {generalItems.map((item) => renderButton(item))}
            </div>
          </TabsContent>
          <TabsContent value="transform" className="p-4">
            <div className="flex space-x-2">
              {TransformItems.map((item) => renderButton(item))}
            </div>
          </TabsContent>
          <TabsContent value="load" className="p-4">
            <div className="flex space-x-2">
              {LoadItems.map((item) => renderButton(item))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
