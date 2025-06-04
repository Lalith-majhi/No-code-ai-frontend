import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import BaseNode from '../components/BaseNode';
import { FiFilter } from 'react-icons/fi';

const FILTER_OPERATIONS = {
  'equals': 'Equals',
  'contains': 'Contains',
  'startsWith': 'Starts With',
  'endsWith': 'Ends With',
  'greaterThan': 'Greater Than',
  'lessThan': 'Less Than',
  'between': 'Between',
  'regex': 'Regular Expression'
};

export const FilterNode = ({ id, data = { isExpanded: true }, ...props }) => {
  const [operation, setOperation] = useState(data?.operation || 'equals');
  const [condition, setCondition] = useState(data?.condition || '');

  const handleOperationChange = (e) => {
    setOperation(e.target.value);
    if (data?.onDataChange) {
      data.onDataChange(id, 'operation', e.target.value);
    }
  };

  const handleConditionChange = (e) => {
    setCondition(e.target.value);
    if (data?.onDataChange) {
      data.onDataChange(id, 'condition', e.target.value);
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

  const titleContent = (
    <div style={{ width: '100%', padding: '4px 0' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%'
      }}>
        <FiFilter size={18} />
        <span style={{ flex: 1 }}>Filter</span>
      </div>
      <div style={{
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '4px',
        lineHeight: '1.4',
        width: '100%'
      }}>
        Filter data based on conditions
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
        <label style={labelStyle}>Operation</label>
        <select 
          value={operation}
          onChange={handleOperationChange}
          style={selectStyle}
        >
          {Object.entries(FILTER_OPERATIONS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Condition</label>
        <input
          type="text"
          value={condition}
          onChange={handleConditionChange}
          style={inputStyle}
          placeholder="Enter filter condition..."
        />
      </div>
    </div>
  );

  return (
    <BaseNode
      id={id}
      type="FilterNode"
      label={titleContent}
      data={{
        ...data,
        isExpanded: data.isExpanded ?? true,
        label: titleContent,
        operation,
        condition
      }}
      content={nodeContent}
      {...props}
    />
  );
}; 