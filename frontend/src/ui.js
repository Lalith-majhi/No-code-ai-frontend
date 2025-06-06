// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import React, { useCallback, useState } from 'react';
import ReactFlow, { 
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes, nodeDefinitions } from './config/nodeDefinitions';
import CustomEdge from './components/CustomEdge';

// Define edge types
const edgeTypes = {
  custom: CustomEdge
};

const UI = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const { project } = useReactFlow();

  // Add handler for edge deletion
  const handleEdgeDelete = useCallback((edgeId) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  }, [setEdges]);

  // Add handler for node data changes
  const handleNodeDataChange = useCallback((nodeId, field, value) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              [field]: value
            }
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const onConnectStart = useCallback(() => {
    setIsConnecting(true);
  }, []);

  const onConnectEnd = useCallback(() => {
    setIsConnecting(false);
  }, []);

  const onConnect = useCallback(
    (params) => {
      // Validate connection
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      if (!sourceNode || !targetNode) return;

      // Check if output and input types are compatible
      const sourceOutput = sourceNode.data.outputs.find(o => o === params.sourceHandle);
      const targetInput = targetNode.data.inputs.find(i => i === params.targetHandle);

      if (!sourceOutput || !targetInput) return;

      setIsConnecting(false);

      // Add the edge with custom type and delete handler
      setEdges((eds) => addEdge({
        ...params,
        type: 'custom',
        animated: false,
        style: { 
          stroke: '#6466f1',
          strokeWidth: 2
        },
        data: {
          onEdgeDelete: handleEdgeDelete
        }
      }, eds));
    },
    [nodes, setEdges, handleEdgeDelete]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleNodeExpand = useCallback((nodeId) => {
    setNodes((nds) => 
      nds.map((node) => {
        if (node.id === nodeId) {
          const isExpanded = !node.data.isExpanded;
          return {
            ...node,
            data: {
              ...node.data,
              isExpanded
            }
          };
        }
        return node;
      })
    );
  }, []);

  const handleNodeDelete = useCallback((nodeId) => {
    setEdges((eds) => eds.filter(
      edge => edge.source !== nodeId && edge.target !== nodeId
    ));
    setNodes((nds) => nds.filter(node => node.id !== nodeId));
  }, [setEdges, setNodes]);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const data = event.dataTransfer.getData('application/reactflow');
      if (!data) return;

      try {
        const { type, data: nodeData } = JSON.parse(data);
        const definition = nodeDefinitions[type];
        if (!definition) return;

        const reactFlowBounds = event.target.getBoundingClientRect();
        const position = project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top
        });

        const existingNodesOfType = nodes.filter(n => n.type === type).length;
        const newNodeNumber = existingNodesOfType + 1;

        const newNode = {
          id: `${type}-${newNodeNumber}`,
          type,
          position,
          data: {
            id: `${type}-${newNodeNumber}`,
            label: definition.label,
            inputs: definition.inputs || [],
            outputs: definition.outputs || [],
            onExpand: handleNodeExpand,
            onDelete: handleNodeDelete,
            onDataChange: handleNodeDataChange,
            isExpanded: true
          },
          style: {
            ...definition.style,
            transition: 'all 0.3s ease',
            width: '250px',  // Fixed width for all nodes
            minWidth: '250px',
            maxWidth: '250px'
          }
        };

        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        console.error('Error creating node:', error);
      }
    },
    [nodes, setNodes, handleNodeExpand, handleNodeDelete, handleNodeDataChange, project]
  );

  const onNodesDelete = useCallback(
    (nodesToDelete) => {
      nodesToDelete.forEach(node => {
        handleNodeDelete(node.id);
      });
    },
    [handleNodeDelete]
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView={false}  // Disable automatic fitting
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}  // Set default viewport
        minZoom={0.1}
        maxZoom={2}
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode={['Meta', 'Shift']}
        snapToGrid={true}
        snapGrid={[15, 15]}
        connectionMode="loose"
        connectionLineStyle={{
          stroke: '#6466f1',
          strokeWidth: 2,
          strokeDasharray: '5 5',
          strokeOpacity: 0.75
        }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default UI;
