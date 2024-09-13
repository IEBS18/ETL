import React, { useState, useEffect } from 'react';
import { LucideArrowUp, LucideArrowDown } from 'lucide-react';
import './DraggableTable.css';
import { getData, getFilenames } from './data.js';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const DraggableTable = ({ toggleTablePosition, isTableAtTop }) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [selectedFile, setSelectedFile] = useState('');
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const filenames = getFilenames();

  useEffect(() => {
    if (selectedFile) {
      try {
        const data = getData();
        console.log('Fetched Data:', data); 
        const nodeId = Object.keys(data).find(
          (id) => data[id]?.fileName === selectedFile
        );
        console.log('Node ID:', nodeId);
        if (nodeId) {
          setTableData(data[nodeId] || { columns: [], rows: [] });
        } else {
          setTableData({ columns: [], rows: [] }); 
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setTableData({ columns: [], rows: [] }); 
      }
    }
  }, [selectedFile]);

  const toggleView = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`draggable-table ${isMinimized ? 'minimized' : ''}`}>
      <div className="drag-handle flex justify-between items-center p-2 bg-green shadow-md">
        <div className="flex items-center">
          <div className='w-full mr-4'>Data Preview : </div>
          <Select value={selectedFile} className='bg-black text-black' onValueChange={(value) => setSelectedFile(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select File" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem placeholder='Select a file'>Select File</SelectItem>
              {filenames.map((fileName, index) => (
                <SelectItem key={index} value={fileName}>
                  {fileName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <button onClick={() => { toggleTablePosition(); toggleView(); }} className="focus:outline-none">
          {isTableAtTop ? <LucideArrowDown size={24} /> : <LucideArrowUp size={24} />}
        </button>
      </div>
      {!isMinimized && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                {tableData?.columns?.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData?.rows?.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {tableData?.columns?.map((col, colIndex) => (
                    <td key={colIndex}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DraggableTable;
