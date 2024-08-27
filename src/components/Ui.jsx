import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronLeft, Share, Play, Settings, ChevronDown, Upload } from "lucide-react";
import awsS3 from "../assets/export/awsS3.png";
import mysql from "../assets/export/mysql.png";
import file from "../assets/export/file.png";
import { useDnD } from './DnDContext';
import LocalExtractNode from "./LocalExtractNode";
import { useCallback, useState } from 'react';

// const nodeTypes = { localExtractor: LocalExtractNode };

export default function Component() {
  const generalItems = [
    { name: "Local", icon: <img src={file} alt="file" className="h-4 w-4"/>, type:"LocalExtractor" },
    { name: "Amazon S3", icon: <img src={awsS3} alt="sql" className="h-4 w-4"/>, type: "AWSExtractor"},
    { name: "SQL Server", icon:  <img src={mysql} alt="awsS3" className="h-4 w-4"/>, type: "SQLExtractor"},
  ];

  const [_, setType] = useDnD();

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };



  return (
    <div className="flex flex-col bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Pipelines</span>
            <span className="text-sm text-muted-foreground">&gt;</span>
            <Input 
              className="h-8 w-40"
              defaultValue="Untitled Pipeline"
            />
          </div>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-green-500 text-white hover:bg-green-600">
            Changes Deployed
          </Button>
          <Button variant="ghost" size="icon">
            <Share className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Play className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <Tabs defaultValue="extract" className="">
        <TabsList className="bg-background border-b px-4">
          <TabsTrigger value="extract">Extract</TabsTrigger>
          <TabsTrigger value="transform">Transform</TabsTrigger>
          <TabsTrigger value="load">Load</TabsTrigger>
          {/* <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="data-loaders">Data Loaders</TabsTrigger>
          <TabsTrigger value="multi-modal">Multi-Modal</TabsTrigger>
          <TabsTrigger value="logic">Logic</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger> */}
        </TabsList>
        <TabsContent value="extract" className="p-4 bg-gray-50">
          <div className="flex space-x-2">
            {generalItems.map((item) => (
              <DropdownMenu key={item.name}>
                  <Button variant="outline" className="h-10 px-3 py-2" onDragStart={(event) => onDragStart(event, item.type)} draggable>
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                    {/* <ChevronDown className="ml-2 h-4 w-4" /> */}
                  </Button>
              </DropdownMenu>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
