import React from 'react';
import { Handle } from 'reactflow';
import { theme } from '../styles/theme';

const BaseNode = ({ 
  type,
  label,
  inputs = [],
  outputs = [],
  content,
  style = {},
  data
}) => {
  const baseStyle = {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.md,
    minWidth: '200px',
    maxWidth: '300px',
    ...style
  };

  const headerStyle = {
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderBottom: `1px solid ${theme.colors.border}`,
    color: theme.colors.text.primary,
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const handleStyle = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: `2px solid ${theme.colors.border}`,
    background: theme.colors.surface
  };

  const contentStyle = {
    padding: theme.spacing.sm
  };

  return (
    <div style={baseStyle}>
      <div style={headerStyle}>
        <span>{label || type}</span>
        {data?.subtitle && (
          <span style={{ 
            fontSize: '0.75rem', 
            color: theme.colors.text.secondary 
          }}>
            {data.subtitle}
          </span>
        )}
      </div>

      {/* Input Handles */}
      {inputs.map((input, index) => (
        <Handle
          key={`input-${index}`}
          type="target"
          position="left"
          id={input}
          style={{
            ...handleStyle,
            top: `${((index + 1) * 100) / (inputs.length + 1)}%`,
          }}
        />
      ))}

      {/* Content Area */}
      <div style={contentStyle}>
        {content}
      </div>

      {/* Output Handles */}
      {outputs.map((output, index) => (
        <Handle
          key={`output-${index}`}
          type="source"
          position="right"
          id={output}
          style={{
            ...handleStyle,
            top: `${((index + 1) * 100) / (outputs.length + 1)}%`,
          }}
        />
      ))}
    </div>
  );
};

export default BaseNode; 