// textNode.js

import { useState, useEffect, useRef } from 'react';
import BaseNode from '../components/BaseNode';
import { TbTextRecognition } from 'react-icons/tb';

export const TextNode = ({ id, data = { isExpanded: true }, ...props }) => {
  const [currText, setCurrText] = useState(data?.text || '');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);

  // Function to detect variables in the text
  const detectVariables = (text) => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = [...text.matchAll(regex)];
    return matches.map(match => match[1].trim());
  };

  // Function to adjust textarea height
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Update variables when text changes
  useEffect(() => {
    const detectedVars = detectVariables(currText);
    setVariables(detectedVars);
  }, [currText]);

  // Adjust height when text changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [currText]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
    if (data?.onDataChange) {
      data.onDataChange(id, 'text', e.target.value);
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
    color: '#444',
    fontWeight: '600',
    marginBottom: '2px'
  };

  const textareaStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '0.9rem',
    width: '100%',
    minHeight: '60px',
    maxHeight: '400px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff',
    resize: 'none',
    fontFamily: 'inherit',
    overflowY: 'hidden',
    '&:focus': {
      borderColor: '#6466f1',
      boxShadow: '0 0 0 3px rgba(100, 102, 241, 0.1)'
    }
  };

  const variableStyle = {
    fontSize: '0.8rem',
    color: '#6466f1',
    padding: '4px 8px',
    backgroundColor: 'rgba(100, 102, 241, 0.1)',
    borderRadius: '4px',
    margin: '2px',
    display: 'inline-block'
  };

  const titleContent = (
    <div style={{ width: '100%', padding: '4px 0' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%'
      }}>
        <TbTextRecognition size={18} />
        <span style={{ flex: 1 }}>Text</span>
      </div>
      <div style={{
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '4px',
        lineHeight: '1.4',
        width: '100%'
      }}>
        Create and edit text content for your workflow
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
        <label style={labelStyle}>Text Content</label>
        <textarea
          ref={textareaRef}
          value={currText} 
          onChange={handleTextChange} 
          style={textareaStyle}
          placeholder="Enter your text here... Use {{variable}} for dynamic values"
        />
        {variables.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <label style={labelStyle}>Variables Used:</label>
            <div style={{ marginTop: '4px' }}>
              {variables.map((variable, index) => (
                <span key={index} style={variableStyle}>
                  {variable}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <BaseNode
      id={id}
      type="TextNode"
      label={titleContent}
      data={{
        ...data,
        isExpanded: data.isExpanded ?? true,
        label: titleContent,
        text: currText,
        variables
      }}
      content={nodeContent}
      {...props}
    />
  );
};
