import React from 'react';
import BaseNode from '../components/BaseNode';
import { InputNode } from '../nodes/inputNode';
import { TextNode } from '../nodes/textNode';
import { LLMNode } from '../nodes/llmNode';
import { OutputNode } from '../nodes/outputNode';
import { MathNode } from '../nodes/mathNode';
import { PromptNode } from '../nodes/promptNode';
import { ImageNode } from '../nodes/imageNode';
import { FilterNode } from '../nodes/filterNode';
import { LoggerNode } from '../nodes/loggerNode';
import { TranslationNode } from '../nodes/translationNode';

// Node-specific content components
const TextEditor = () => (
  <textarea placeholder="Enter text..." style={{ width: '100%', minHeight: '100px' }} />
);

const MathForm = () => (
  <div>
    <select style={{ width: '100%', marginBottom: '8px' }}>
      <option value="add">Add</option>
      <option value="subtract">Subtract</option>
      <option value="multiply">Multiply</option>
      <option value="divide">Divide</option>
    </select>
  </div>
);

const PromptInput = () => (
  <textarea placeholder="Enter prompt template..." style={{ width: '100%', minHeight: '80px' }} />
);

const ImagePreview = () => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ padding: '10px', border: '1px dashed #ccc', marginBottom: '8px' }}>
      Image Preview
    </div>
    <button style={{ width: '100%' }}>Upload Image</button>
  </div>
);

const FilterConfig = () => (
  <div>
    <input type="text" placeholder="Filter condition..." style={{ width: '100%', marginBottom: '8px' }} />
    <select style={{ width: '100%' }}>
      <option value="equals">Equals</option>
      <option value="contains">Contains</option>
      <option value="greater">Greater Than</option>
      <option value="less">Less Than</option>
    </select>
  </div>
);

const LoggerConfig = () => (
  <div>
    <select style={{ width: '100%', marginBottom: '8px' }}>
      <option value="info">Info</option>
      <option value="warning">Warning</option>
      <option value="error">Error</option>
    </select>
    <input type="text" placeholder="Log prefix..." style={{ width: '100%' }} />
  </div>
);

// Node Definitions
export const nodeDefinitions = {
  InputNode: {
    label: "Input",
    inputs: [],
    outputs: ["output"],
    component: InputNode,
    style: { 
      background: '#fff5f5',
      minWidth: '250px'
    }
  },
  TextNode: {
    label: "Text",
    inputs: [],
    outputs: ["text"],
    component: TextNode,
    style: { background: '#fff5f5' }
  },
  LLMNode: {
    label: "LLM",
    inputs: ["prompt"],
    outputs: ["response"],
    component: LLMNode,
    style: { background: '#f0fff4' }
  },
  OutputNode: {
    label: "Output",
    inputs: ["input"],
    outputs: [],
    component: OutputNode,
    style: { background: '#fff0f6' }
  },
  MathNode: {
    label: "Math Operation",
    inputs: ["value1", "value2"],
    outputs: ["result"],
    component: MathNode,
    style: { background: '#f3f0ff' }
  },
  PromptNode: {
    label: "Prompt Template",
    inputs: ["variables"],
    outputs: ["prompt"],
    component: PromptNode,
    style: { background: '#fff0eb' }
  },
  ImageNode: {
    label: "Image Processing",
    inputs: ["image"],
    outputs: ["processed"],
    component: ImageNode,
    style: { background: '#f0fff4' }
  },
  FilterNode: {
    label: "Filter",
    inputs: ["data"],
    outputs: ["filtered", "rejected"],
    component: FilterNode,
    style: { background: '#fff8f0' }
  },
  LoggerNode: {
    label: "Logger",
    inputs: ["data"],
    outputs: ["logged"],
    component: LoggerNode,
    style: { background: '#f5f5f5' }
  },
  // Updated Translation Node
  TranslationNode: {
    label: "Translation",
    inputs: ["text"],
    outputs: ["translatedText"],
    component: TranslationNode,
    style: { 
      background: '#e6f3ff',
      minWidth: '200px'
    }
  }
};

// Node Component Factory
export const createNodeComponent = (type) => {
  const definition = nodeDefinitions[type];
  if (!definition) {
    console.error(`No definition found for node type: ${type}`);
    return null;
  }

  if (definition.component) {
    return definition.component;
  }

  return (props) => (
    <BaseNode
      type={type}
      {...definition}
      {...props}
    />
  );
};

// Register all nodes with react-flow
export const nodeTypes = Object.keys(nodeDefinitions).reduce((types, type) => {
  types[type] = createNodeComponent(type);
  return types;
}, {}); 