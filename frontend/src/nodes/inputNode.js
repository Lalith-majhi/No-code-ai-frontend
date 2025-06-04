// inputNode.js

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import BaseNode from '../components/BaseNode';
import { BsBoxArrowInRight } from 'react-icons/bs';

const INPUT_TYPES = {
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

export const InputNode = ({ id, data = { isExpanded: true }, ...props }) => {
  // Extract node number from id for auto-incrementing label
  const nodeNumber = id.split('-')[1] || '0';
  const defaultName = `input_${nodeNumber}`;
  
  const [currName, setCurrName] = useState(data?.inputName || defaultName);
  const [inputType, setInputType] = useState(data?.inputType || 'text');

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
    if (data?.onDataChange) {
      data.onDataChange(id, 'inputName', e.target.value);
    }
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
    if (data?.onDataChange) {
      data.onDataChange(id, 'inputType', e.target.value);
    }
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1a1a1a'
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

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '0.9rem',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#f5f5f5',
    cursor: 'not-allowed',
    color: '#666',
    textAlign: 'center'
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: '#fff',
    cursor: 'pointer',
    textAlign: 'left',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '12px',
    paddingRight: '32px'
  };

  const titleContent = (
    <div style={{ width: '100%', padding: '4px 0' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%'
      }}>
        <BsBoxArrowInRight size={18} />
        <span style={{ flex: 1 }}>Input</span>
      </div>
      <div style={{
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '4px',
        lineHeight: '1.4',
        width: '100%'
      }}>
        Pass data of different types into your workflow
      </div>
    </div>
  );

  const baseStyle = {
    minWidth: '200px',
    width: 'fit-content',
    padding: '12px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

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
        <label style={labelStyle}>Input Name</label>
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
        <label style={labelStyle}>Input Type</label>
        <select 
          value={inputType} 
          onChange={handleTypeChange}
          style={selectStyle}
        >
          {Object.entries(INPUT_TYPES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <BaseNode
      id={id}
      type="InputNode"
      label={titleContent}
      data={{
        ...data,
        isExpanded: data.isExpanded ?? true,
        label: titleContent,
        inputName: currName,
        inputType: inputType
      }}
      content={nodeContent}
      {...props}
    />
  );
};
