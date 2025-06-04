import React, { useState } from 'react';
import { Handle } from 'reactflow';
import { theme } from '../styles/theme';
import { IoExpandOutline, IoContractOutline } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { MdClose } from 'react-icons/md';

const DeleteConfirmDialog = ({ onConfirm, onCancel, nodeName }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '100%',
      right: '0',
      marginTop: '8px',
      background: 'white',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      width: '220px',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h4 style={{ 
          margin: 0, 
          fontSize: '0.9rem',
          color: '#ef4444'
        }}>
          Delete Node
        </h4>
        <button
          onClick={onCancel}
          style={{
            border: 'none',
            background: 'none',
            padding: '4px',
            cursor: 'pointer',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.05)'
            }
          }}
        >
          <MdClose size={16} />
        </button>
      </div>
      <p style={{ 
        margin: '0 0 16px 0',
        fontSize: '0.8rem',
        color: 'rgba(0, 0, 0, 0.7)',
        lineHeight: '1.4'
      }}>
        Are you sure you want to delete "{nodeName}"? This action cannot be undone.
      </p>
      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={onCancel}
          style={{
            padding: '6px 12px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '6px',
            background: 'white',
            color: 'rgba(0, 0, 0, 0.7)',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.05)'
            }
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            padding: '6px 12px',
            border: 'none',
            borderRadius: '6px',
            background: '#ef4444',
            color: 'white',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: '#dc2626'
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const BaseNode = ({ 
  id,
  type,
  label,
  inputs = [],
  outputs = [],
  content,
  style = {},
  data
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const baseStyle = {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.md,
    minWidth: '200px',
    maxWidth: data?.isExpanded ? 'none' : '300px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
    justifyContent: 'space-between',
    backgroundColor: data?.isExpanded ? 'rgba(100, 102, 241, 0.05)' : 'transparent',
    borderRadius: `${theme.borderRadius.lg - 2}px ${theme.borderRadius.lg - 2}px 0 0`,
    transition: 'background-color 0.3s ease',
    position: 'relative'
  };

  const headerContentStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const headerActionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.2s ease'
  };

  const iconButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '6px',
    cursor: 'pointer',
    color: theme.colors.text.secondary,
    transition: 'all 0.2s ease',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.05)',
      color: theme.colors.text.primary
    }
  };

  const handleStyle = (isInput) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: `2px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#6466f1',
      border: '2px solid #6466f1',
      boxShadow: '0 0 0 3px rgba(100, 102, 241, 0.2)'
    }
  });

  const handleLabelStyle = {
    position: 'absolute',
    fontSize: '0.7rem',
    color: theme.colors.text.secondary,
    transition: 'opacity 0.2s ease',
    opacity: 0,
    pointerEvents: 'none'
  };

  const contentStyle = {
    padding: theme.spacing.sm,
    position: 'relative',
    transition: 'all 0.3s ease',
    minHeight: data?.isExpanded ? '200px' : 'auto'
  };

  const handleExpand = (e) => {
    e.stopPropagation();
    if (data?.onExpand) {
      data.onExpand(data.id);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = (e) => {
    if (e) e.stopPropagation();
    if (data?.onDelete) {
      data.onDelete(data.id);
    }
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = (e) => {
    if (e) e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <div 
      style={baseStyle}
      onMouseEnter={() => {
        setIsHovered(true);
        const handles = document.querySelectorAll('.react-flow__handle');
        handles.forEach(handle => {
          if (handle.closest('.react-flow__node').contains(handle)) {
            handle.style.opacity = '1';
          }
        });
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        const handles = document.querySelectorAll('.react-flow__handle');
        handles.forEach(handle => {
          if (handle.closest('.react-flow__node').contains(handle)) {
            handle.style.opacity = '0.5';
          }
        });
      }}
    >
      <div style={headerStyle}>
        <div style={headerContentStyle}>
          <span>{data?.label || label || type}</span>
          {data?.subtitle && (
            <span style={{ 
              fontSize: '0.75rem', 
              color: theme.colors.text.secondary 
            }}>
              {data.subtitle}
            </span>
          )}
        </div>
        <div style={headerActionsStyle}>
          <button
            style={iconButtonStyle}
            onClick={handleExpand}
            title={data?.isExpanded ? "Contract" : "Expand"}
          >
            {data?.isExpanded ? (
              <IoContractOutline size={18} />
            ) : (
              <IoExpandOutline size={18} />
            )}
          </button>
          <button
            style={iconButtonStyle}
            onClick={handleDeleteClick}
            title="Delete"
          >
            <RiDeleteBinLine size={18} />
          </button>
          {showDeleteConfirm && (
            <DeleteConfirmDialog
              nodeName={data?.label || label || type}
              onConfirm={handleDeleteConfirm}
              onCancel={handleDeleteCancel}
            />
          )}
        </div>
      </div>

      {/* Input Handles */}
      {(data?.inputs || inputs).map((input, index, array) => (
        <React.Fragment key={`input-${index}`}>
          <Handle
            type="target"
            position="left"
            id={input}
            style={{
              ...handleStyle(true),
              top: `${((index + 1) * 100) / (array.length + 1)}%`,
            }}
          />
          <div
            style={{
              ...handleLabelStyle,
              left: '24px',
              top: `${((index + 1) * 100) / (array.length + 1)}%`,
              transform: 'translateY(-50%)'
            }}
          >
            {input}
          </div>
        </React.Fragment>
      ))}

      {/* Content Area */}
      <div style={contentStyle}>
        {content}
      </div>

      {/* Output Handles */}
      {(data?.outputs || outputs).map((output, index, array) => (
        <React.Fragment key={`output-${index}`}>
          <Handle
            type="source"
            position="right"
            id={output}
            style={{
              ...handleStyle(false),
              top: `${((index + 1) * 100) / (array.length + 1)}%`,
            }}
          />
          <div
            style={{
              ...handleLabelStyle,
              right: '24px',
              top: `${((index + 1) * 100) / (array.length + 1)}%`,
              transform: 'translateY(-50%)'
            }}
          >
            {output}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default BaseNode; 