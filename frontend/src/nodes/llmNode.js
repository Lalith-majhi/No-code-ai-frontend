// llmNode.js

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import BaseNode from '../components/BaseNode';
import { HiOutlineCpuChip } from 'react-icons/hi2';

const LLM_MODELS = {
  'gpt-4': 'GPT-4',
  'gpt-3.5-turbo': 'GPT-3.5 Turbo',
  'claude-3-opus': 'Claude 3 Opus',
  'claude-3-sonnet': 'Claude 3 Sonnet',
  'gemini-pro': 'Gemini Pro',
  'mistral-large': 'Mistral Large',
  'llama-2': 'Llama 2'
};

export const LLMNode = ({ id, data = { isExpanded: true }, ...props }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4');
  const [systemPrompt, setSystemPrompt] = useState(data?.systemPrompt || '');

  const handleModelChange = (e) => {
    setModel(e.target.value);
    if (data?.onDataChange) {
      data.onDataChange(id, 'model', e.target.value);
    }
  };

  const handleSystemPromptChange = (e) => {
    setSystemPrompt(e.target.value);
    if (data?.onDataChange) {
      data.onDataChange(id, 'systemPrompt', e.target.value);
    }
  };

  const inputGroupStyle = {
    marginBottom: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%'
  };

  const labelStyle = {
    fontSize: '0.8rem',
    color: '#666',
    fontWeight: '500',
    marginBottom: '2px'
  };

  const selectStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '0.9rem',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '12px',
    paddingRight: '32px'
  };

  const textareaStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '0.9rem',
    width: '100%',
    minHeight: '80px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff',
    resize: 'vertical',
    fontFamily: 'inherit',
    '&:focus': {
      borderColor: '#6466f1',
      boxShadow: '0 0 0 3px rgba(100, 102, 241, 0.1)'
    }
  };

  const titleContent = (
    <div style={{ width: '100%', padding: '4px 0' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%'
      }}>
        <HiOutlineCpuChip size={18} />
        <span style={{ flex: 1 }}>LLM</span>
      </div>
      <div style={{
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '4px',
        lineHeight: '1.4',
        width: '100%'
      }}>
        Process text using large language models
      </div>
    </div>
  );

  const nodeContent = (
    <div style={{ 
      width: '100%', 
      padding: '8px 0', 
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Model</label>
        <select 
          value={model}
          onChange={handleModelChange}
          style={selectStyle}
        >
          {Object.entries(LLM_MODELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>System Prompt</label>
        <textarea
          value={systemPrompt}
          onChange={handleSystemPromptChange}
          style={textareaStyle}
          placeholder="Enter system instructions..."
        />
      </div>
    </div>
  );

  return (
    <BaseNode
      id={id}
      type="LLMNode"
      label={titleContent}
      data={{
        ...data,
        isExpanded: data.isExpanded ?? true,
        label: titleContent,
        model,
        systemPrompt
      }}
      content={nodeContent}
      {...props}
    />
  );
};
