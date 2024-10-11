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
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DnDProvider, useDnD } from '@/components/DnDContext';
import '../index.css';
import Component from '@/components/Ui';
import AWSExtractNode from '@/components/AWSExtractNode';
import SQLQueryNode from '@/components/SQLQueryNode';
import CustomEdge from '@/components/CustomEdge';
import LoadNode from '@/components/LoadNode';
import { CSVExtractNode, JSONExtractNode, XLSXExtractNode, XMLExtractNode } from '@/components/FileType';
import DraggableTable from '@/components/DraggableTable';
import OpenAINode from '@/components/OpenAINode';
import ViewNode from '@/components/ViewNode';

const edgeTypes = {
  custom: CustomEdge,
};

const nodeTypes = {
  AWSExtractor: AWSExtractNode,
  SQLQuery: SQLQueryNode,
  FileLoad: LoadNode,
  CSVExtract: CSVExtractNode,
  XLXSExtract: XLSXExtractNode,
  JSONExtract: JSONExtractNode,
  XMLExtract: XMLExtractNode,
  OpenAIQuery: OpenAINode,
  ViewNode: ViewNode
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
  const [isTableAtTop, setIsTableAtTop] = useState(false); // Track the position of the table

  // Toggle the position of the table
  const toggleTablePosition = () => {
    setIsTableAtTop(!isTableAtTop);
  };

  const onConnect = (params) => {
    const sourceNode = nodes.find((node) => node.id === params.source);
    const targetNode = nodes.find((node) => node.id === params.target);

    if (sourceNode && targetNode) {
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
                  filePaths: [...currentFilePaths, filePath],
                },
              };
            }
            return node;
          })
        );
      }
      if (targetNode.type === 'OpenAIQuery') {
        const { filePath } = sourceNode.data;
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === targetNode.id) {
              const currentFilePaths = node.data.filePaths || [];
              return {
                ...node,
                data: {
                  ...node.data,
                  filePaths: [...currentFilePaths, filePath],
                },
              };
            }
            return node;
          })
        );
      }

      if (sourceNode.type === 'SQLQuery' && (targetNode.type === 'FileLoad' || targetNode.type === 'ViewNode')) {
        const { filePath } = sourceNode.data;
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === targetNode.id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  filePath: filePath,
                },
              };
            }
            return node;
          })
        );
      }
      if (sourceNode.type === 'OpenAIQuery' && (targetNode.type === 'FileLoad' || targetNode.type === 'ViewNode')) {
        const { filePath } = sourceNode.data;
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === targetNode.id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  filePath: filePath,
                },
              };
            }
            return node;
          })
        );
      }
    }

    setEdges((eds) => addEdge({ ...params, type: 'custom', animated: true, deletable: true }, eds));
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
    [screenToFlowPosition, type, nodes, setNodes, setTableData]
  );

  return (
    <div className="relative flex flex-col h-full">
      <Component nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges} />
      <div className="reactflow-wrapper relative" style={{ width: '100%', height: '60vh' }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView={false}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          className="h-full w-full"
        >
          <Controls position="top-right" />
          <MiniMap />
          <Background variant={BackgroundVariant.Lines} gap={12} size={1} />
        </ReactFlow>

        {/* Draggable table with arrow inside the table */}
        <div
          className={`absolute ${isTableAtTop ? 'top-0' : 'bottom-0'} left-0 w-full transition-all duration-500`}
          style={{ zIndex: 10 }} // Ensure table is on top of ReactFlow but below header
        >
          <DraggableTable
            data={tableData}
            toggleTablePosition={toggleTablePosition} // Pass the toggle function
            isTableAtTop={isTableAtTop} // Pass current state to control arrow icon
          />
        </div>
      </div>
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
