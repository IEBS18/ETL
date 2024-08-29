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
import CustomEdge from './components/CustomEdge';
import LoadNode from './components/LoadNode';

const edgeTypes = {
  custom: CustomEdge,
};
const nodeTypes = { LocalExtractor: LocalExtractNode, AWSExtractor: AWSExtractNode, SQLExtractor: SQLExtractNode, SQLQuery: SQLQueryNode, FileLoad: LoadNode };

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

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

    setEdges((eds) => addEdge({ ...params, type: 'custom' }, eds));
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

  // const handleSave = () => {
  //   const flow = {
  //     nodes,
  //     edges,
  //   };
  //   localStorage.setItem('flow', JSON.stringify(flow));
  //   alert('Flow saved!');
  // };

  // const handleRestore = () => {
  //   const flow = JSON.parse(localStorage.getItem('flow'));
  //   if (flow) {
  //     const restoredNodes = flow.nodes.map((node) => ({
  //       ...node,
  //       data: {
  //         ...node.data,
  //         setNodes: setNodes, // Reassign the setNodes function
  //       },
  //     }));

  //     setNodes(restoredNodes);
  //     setEdges(flow.edges || []);
  //     alert('Flow restored!');
  //   } else {
  //     alert('No flow data found!');
  //   }
  // };


  return (
    <div className="flex flex-col">
      {/* <Sidebar /> */}
      <Component
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
      />
      {/* <div className="mb-4">
        <button onClick={handleSave} className="px-4 py-2 mr-2 bg-blue-500 text-white rounded">
          Save
        </button>
        <button onClick={handleRestore} className="px-4 py-2 bg-green-500 text-white rounded">
          Restore
        </button>
      </div> */}
      <div className="reactflow-wrapper" style={{ width: '100vw', height: '53vh' }} ref={reactFlowWrapper}>
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
