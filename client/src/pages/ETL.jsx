import React, { useRef, useCallback, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  MiniMap,
  Background,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DnDProvider, useDnD } from '@/components/DnDContext';

import '../index.css';
import Component from '@/components/Ui';

// import LocalExtractNode from './components/LocalExtractNode';
import AWSExtractNode from '@/components/AWSExtractNode';
import SQLQueryNode from '@/components/SQLQueryNode';
import CustomEdge from '@/components/CustomEdge';
import LoadNode from '@/components/LoadNode';
import {CSVExtractNode, JSONExtractNode, XLSXExtractNode, XMLExtractNode} from '@/components/FileType';
// import DraggableTable from './components/DraggableTable';

const edgeTypes = {
  custom: CustomEdge,
};

const nodeTypes = { 
  // LocalExtractor: LocalExtractNode, 
  AWSExtractor: AWSExtractNode, 
  SQLQuery: SQLQueryNode, 
  FileLoad: LoadNode,
  CSVExtract: CSVExtractNode,
  XLXSExtract: XLSXExtractNode,
  JSONExtract: JSONExtractNode,
  XMLExtract: XMLExtractNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const [tableData, setTableData] = useState(null);

  const onConnectStart = (event, params) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === params.nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              isConnecting: true,
            },
          };
        }
        return node;
      })
    );
  };

  const onConnectEnd = () => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isConnecting: false,
        },
      }))
    );
  };

  // const onConnect = (params) => {
  //   const sourceNode = nodes.find(node => node.id === params.source);
  //   const targetNode = nodes.find(node => node.id === params.target);

  //   if (sourceNode && targetNode) {
  //     const { filePath } = sourceNode.data;

  //     setNodes((nds) =>
  //       nds.map((node) => {
  //         if (node.id === targetNode.id) {
  //           return {
  //             ...node,
  //             data: {
  //               ...node.data,
  //               sourceId: sourceNode.id,
  //               filePath: filePath || 'No file path available',
  //             },
  //           };
  //         }
  //         return node;
  //       })
  //     );
  //   }

  //   setEdges((eds) => addEdge({ ...params, type: 'custom', animated: true, deletable: true }, eds));

  //   onConnectEnd(); // Reset the connecting state after connecting
  // };

  const onConnect = (params) => {
    const sourceNode = nodes.find(node => node.id === params.source);
    const targetNode = nodes.find(node => node.id === params.target);
  
    if (sourceNode && targetNode) {
      // Handle connection to SQLQueryNode (collect multiple file paths)
      if (targetNode.type === 'SQLQuery') {
        const { filePath } = sourceNode.data;
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === targetNode.id) {
              const currentFilePaths = node.data.filePaths || [];
              return {
                ...node,
                data: {
                  ...node.data,
                  filePaths: [...currentFilePaths, filePath], // Append new filePath to array
                },
              };
            }
            return node;
          })
        );
      }
      
      // Handle connection from SQLQueryNode to LoadNode (pass single file path)
      if (sourceNode.type === 'SQLQuery' && targetNode.type === 'FileLoad') {
        const { filePath } = sourceNode.data;
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === targetNode.id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  filePath: filePath, // Pass the single file path
                },
              };
            }
            return node;
          })
        );
      }
    }
  
    setEdges((eds) => addEdge({ ...params, type: 'custom', animated: true, deletable: true }, eds));
    onConnectEnd(); // Reset the connecting state after connecting
  };
  

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node`, setNodes, nodes, setTableData },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, nodes, setNodes, setTableData],
  );

  return (
    <div className="flex flex-col">
      <Component
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
      />
      <div className="reactflow-wrapper" style={{ width: '100%', height: '60vh' }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
        >
          <Controls position='top-right'/>
          <MiniMap />
          <Background variant={BackgroundVariant.Lines} gap={12} size={1}/>
        </ReactFlow>
      </div>
      {/* <DraggableTable data={tableData} /> */}
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <DnDFlow />
    </DnDProvider>
  </ReactFlowProvider>
);
