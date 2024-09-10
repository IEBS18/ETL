import React, { useState } from 'react';
import Draggable from 'react-draggable';
import './DraggableTable.css'; // Styling

const DraggableTable = ({ data }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleView = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <Draggable axis="y" bounds="parent">
      <div className={`draggable-table ${isMinimized ? 'minimized' : ''}`}>
        <div className="drag-handle">
          <button onClick={toggleView} className="toggle-btn">
            {isMinimized ? 'Maximize' : 'Minimize'}
          </button>
        </div>
        <div className={`table-container ${isMinimized ? 'minimized' : ''}`}>
          <table className="table">
            <thead>
              <tr>
                {data?.columns?.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            {!isMinimized && (
              <tbody>
                {data?.rows?.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </Draggable>
  );
};

export default DraggableTable;
