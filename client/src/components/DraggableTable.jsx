"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { getData, getFilenames } from "./data.js";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DraggableTable({ toggleTablePosition, isTableAtTop }) {
  const [isMinimized, setIsMinimized] = useState(true);
  const [selectedFile, setSelectedFile] = useState("");
  const [tableData, setTableData] = useState({ columns: [], rows: [], schema: {} });
  const [activeTab, setActiveTab] = useState("preview");
  const filenames = getFilenames();

  useEffect(() => {
    if (selectedFile) {
      try {
        const data = getData();
        const nodeId = Object.keys(data).find(
          (id) => data[id]?.fileName === selectedFile
        );
        if (nodeId) {
          const fileData = data[nodeId];
          console.log("Fetched File Data:", fileData); // Debug log for fetched data
          setTableData(fileData || { columns: [], rows: [], schema: {} });
        } else {
          setTableData({ columns: [], rows: [], schema: {} });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setTableData({ columns: [], rows: [], schema: {} });
      }
    }
  }, [selectedFile]);

  const toggleView = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div
      className={`border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md ${
        isMinimized ? "h-16" : "h-[500px]"
      }`}
    >
      <div className="flex justify-between items-center p-2 bg-gray-100">
        <div className="flex items-center space-x-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[300px]">
            <TabsList>
              <TabsTrigger value="preview">Data Preview</TabsTrigger>
              <TabsTrigger value="schema">Schema</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select
            value={selectedFile}
            onValueChange={(value) => setSelectedFile(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select File" />
            </SelectTrigger>
            <SelectContent>
              {filenames.map((fileName, index) => (
                <SelectItem key={index} value={fileName}>
                  {fileName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <button
          onClick={() => {
            toggleTablePosition();
            toggleView();
          }}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
        >
          {isTableAtTop ? <ArrowDown size={20} /> : <ArrowUp size={20} />}
        </button>
      </div>
      {!isMinimized && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-[calc(100%-4rem)]">
          {activeTab === "preview" && (
            <TabsContent value="preview" className="h-full overflow-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {tableData?.columns?.map((col, index) => (
                      <th
                        key={index}
                        className="p-2 border border-gray-200 text-left"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData?.rows?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {tableData?.columns?.map((col, colIndex) => (
                        <td key={colIndex} className="p-2 border border-gray-200">
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabsContent>
          )}
          {activeTab === "schema" && (
            <TabsContent value="schema" className="h-full overflow-auto p-4">
              <h3 className="text-lg font-semibold mb-2">
                Schema for {selectedFile}
              </h3>
              {tableData?.schema && Object.keys(tableData.schema).length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2 border border-gray-200 text-left">Column Name</th>
                      <th className="p-2 border border-gray-200 text-left">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(tableData.schema).map(([columnName, columnType], index) => (
                      <tr key={index}>
                        <td className="p-2 border border-gray-200">{columnName}</td>
                        <td className="p-2 border border-gray-200">{columnType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No schema available</p>
              )}
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}

 