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
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes, nodeDefinitions } from './config/nodeDefinitions';

const UI = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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

      // Add the edge with animation
      setEdges((eds) => addEdge({
        ...params,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#6466f1' }
      }, eds));
    },
    [nodes, setEdges]
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

        // Get the drop position relative to the viewport
        const reactFlowBounds = event.target.getBoundingClientRect();
        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top
        };

        // Count existing nodes of this type for auto-incrementing
        const existingNodesOfType = nodes.filter(n => n.type === type).length;
        const newNodeNumber = existingNodesOfType + 1;

        // Create new node with the enhanced data
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
            transition: 'all 0.3s ease'
          }
        };

        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        console.error('Error creating node:', error);
      }
    },
    [nodes, setNodes, handleNodeExpand, handleNodeDelete, handleNodeDataChange]
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
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode={['Meta', 'Shift']}
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default UI;
