// outputNode.js

import { useState, useEffect } from 'react';
import BaseNode from '../components/BaseNode';
import { BsBoxArrowRight } from 'react-icons/bs';

const OUTPUT_TYPES = {
  'text': 'Text',
  'number': 'Number',
  'file': 'File',
  'image': 'Image',
  'audio': 'Audio',
  'video': 'Video',
  'json': 'JSON',
  'csv': 'CSV',
  'boolean': 'Boolean'
};

export const OutputNode = ({ id, data = { isExpanded: true }, ...props }) => {
  // Extract node number from id for auto-incrementing label
  const nodeNumber = id.split('-')[1] || '0';
  const defaultName = `output_${nodeNumber}`;

  const [currName, setCurrName] = useState(data?.outputName || defaultName);
  const [outputType, setOutputType] = useState(data?.outputType || 'text');
  const [outputValue, setOutputValue] = useState(data?.outputValue || '');
  const [variables, setVariables] = useState([]);

  // Function to detect variables in the output value
  const detectVariables = (text) => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = [...text.toString().matchAll(regex)];
    return matches.map(match => match[1].trim());
  };

  // Update variables when output value changes
  useEffect(() => {
    const detectedVars = detectVariables(outputValue);
    setVariables(detectedVars);
  }, [outputValue]);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
    if (data?.onDataChange) {
      data.onDataChange(id, 'outputName', e.target.value);
    }
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
    if (data?.onDataChange) {
      data.onDataChange(id, 'outputType', e.target.value);
    }
  };

  const handleOutputChange = (e) => {
    setOutputValue(e.target.value);
    if (data?.onDataChange) {
      data.onDataChange(id, 'outputValue', e.target.value);
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

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '0.9rem',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff',
    '&:focus': {
      borderColor: '#6466f1',
      boxShadow: '0 0 0 3px rgba(100, 102, 241, 0.1)'
    }
  };

  const selectStyle = {
    ...inputStyle,
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
    minHeight: '60px',
    maxHeight: '200px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff',
    resize: 'vertical',
    fontFamily: 'inherit',
    overflowY: 'auto',
    '&:focus': {
      borderColor: '#6466f1',
      boxShadow: '0 0 0 3px rgba(100, 102, 241, 0.1)'
    }
  };

  const outputPreviewStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '0.9rem',
    width: '100%',
    minHeight: '60px',
    maxHeight: '200px',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    resize: 'vertical',
    fontFamily: 'inherit',
    overflowY: 'auto'
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
        <BsBoxArrowRight size={18} />
        <span style={{ flex: 1 }}>Output</span>
      </div>
      <div style={{
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '4px',
        lineHeight: '1.4',
        width: '100%'
      }}>
        Define output format and preview output data
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
        <label style={labelStyle}>Output Name</label>
        <input 
          type="text" 
          value={defaultName}
          style={inputStyle}
          placeholder={defaultName}
          readOnly
          disabled
        />
      </div>
      
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Output Type</label>
        <select 
          value={outputType} 
          onChange={handleTypeChange}
          style={selectStyle}
        >
          {Object.entries(OUTPUT_TYPES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Output</label>
        <textarea
          value={outputValue}
          onChange={handleOutputChange}
          style={textareaStyle}
          placeholder="Preview of output data... Use {{variable}} for dynamic values"
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
      type="OutputNode"
      label={titleContent}
      data={{
        ...data,
        isExpanded: data.isExpanded ?? true,
        label: titleContent,
        outputName: currName,
        outputType,
        outputValue,
        variables
      }}
      content={nodeContent}
      {...props}
    />
  );
};
