import React, { useRef, useCallback } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DnDProvider, useDnD } from './components/DnDContext';
import Sidebar from './Sidebar';

import './index.css';
import Component from './components/Ui';

import LocalExtractNode from './components/LocalExtractNode';
import AWSExtractNode from './components/AWSExtractNode';
import SQLExtractNode from './components/SQLExtractNode';
import SQLQueryNode from './components/SQLQueryNode';


const nodeTypes = { LocalExtractor: LocalExtractNode, AWSExtractor: AWSExtractNode, SQLExtractor: SQLExtractNode , SQLQuery: SQLQueryNode};

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  // const onConnect = useCallback(
  //   (params) => setEdges((eds) => addEdge(params, eds)),
  //   [],
  // );

  const onConnect = (params) => {
    const sourceNode = nodes.find(node => node.id === params.source);
    const targetNode = nodes.find(node => node.id === params.target);

    if (sourceNode && targetNode) {
      const { filePath } = sourceNode.data;

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === targetNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                sourceId: sourceNode.id,
                filePath: filePath || 'No file path available',
              },
            };
          }
          return node;
        })
      );
    }

    setEdges((eds) => addEdge(params, eds));
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
        data: { label: `${type} node`, setNodes, nodes },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, nodes, setNodes],
  );

  return (
    <div className="flex flex-col">
      {/* <Sidebar /> */}
      <Component />
      <div className="reactflow-wrapper" style={{ width: '100vw', height: '71vh' }} ref={reactFlowWrapper}>
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
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
      {/* <Sidebar /> */}
    </div>
  );
};


export default () => (
  <div >
    <ReactFlowProvider>
      <DnDProvider>
        <DnDFlow />
      </DnDProvider>
    </ReactFlowProvider>
  </div>
);