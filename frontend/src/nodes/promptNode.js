import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import BaseNode from '../components/BaseNode';
import { TbPrompt } from 'react-icons/tb';

export const PromptNode = ({ id, data = { isExpanded: true }, ...props }) => {
  const [promptTemplate, setPromptTemplate] = useState(data?.promptTemplate || '');

  const handlePromptChange = (e) => {
    setPromptTemplate(e.target.value);
    if (data?.onDataChange) {
      data.onDataChange(id, 'promptTemplate', e.target.value);
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

  const textareaStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '0.9rem',
    width: '100%',
    minHeight: '120px',
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
        <TbPrompt size={18} />
        <span style={{ flex: 1 }}>Prompt Template</span>
      </div>
      <div style={{
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '4px',
        lineHeight: '1.4',
        width: '100%'
      }}>
        Create dynamic prompt templates with variables
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
        <label style={labelStyle}>Template</label>
        <textarea
          value={promptTemplate}
          onChange={handlePromptChange}
          style={textareaStyle}
          placeholder="Enter your prompt template here...&#10;Use {{variable}} syntax for dynamic values"
        />
      </div>
    </div>
  );

  return (
    <BaseNode
      id={id}
      type="PromptNode"
      label={titleContent}
      data={{
        ...data,
        isExpanded: data.isExpanded ?? true,
        label: titleContent,
        promptTemplate
      }}
      content={nodeContent}
      {...props}
    />
  );
}; 