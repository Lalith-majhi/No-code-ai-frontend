import React, { useState, useRef, useEffect } from 'react';
import { Handle } from 'reactflow';
import { theme } from '../styles/theme';
import { IoExpandOutline, IoContractOutline } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { MdClose } from 'react-icons/md';

const DeleteConfirmDialog = ({ onCancel }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

  return (
    <div 
      ref={dialogRef}
      className="delete-confirm-dialog"
      style={{
        position: 'absolute',
        top: '-24px',
        right: '0',
        background: 'white',
        padding: '4px 6px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.1)',
        zIndex: 1000,
        fontSize: '0.65rem',
        color: '#374151',
        whiteSpace: 'nowrap',
        animation: 'fadeIn 0.2s ease'
      }}
    >
      Click again to delete
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
  data = { isExpanded: true }
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [deleteConfirmState, setDeleteConfirmState] = useState(false);
  const isExpanded = data?.isExpanded ?? true;
  const nodeRef = useRef(null);

  const baseStyle = {
    padding: '12px',
    borderRadius: theme.borderRadius.lg,
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.md,
    minWidth: '250px',
    width: '250px',
    maxWidth: '250px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    ...style
  };

  const headerStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '4px 8px 12px 8px',
    borderBottom: !isExpanded ? 'none' : `1px solid ${theme.colors.border}`,
    backgroundColor: 'transparent',
    borderRadius: `${theme.borderRadius.lg - 2}px ${theme.borderRadius.lg - 2}px 0 0`,
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  };

  const headerContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '4px',
    padding: '0 32px 0 0'
  };

  const headerActionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.2s ease',
    position: 'absolute',
    top: '8px',
    right: '8px',
    zIndex: 1
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
    padding: '12px 8px',
    position: 'relative',
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
    display: !isExpanded ? 'none' : 'flex',
    flexDirection: 'column',
    opacity: !isExpanded ? 0 : 1,
    height: !isExpanded ? 0 : 'auto',
    overflow: 'hidden'
  };

  const handleExpand = (e) => {
    e.stopPropagation();
    if (data?.onExpand) {
      data.onExpand(id);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (deleteConfirmState) {
      if (data?.onDelete) {
        data.onDelete(id);
      }
      setDeleteConfirmState(false);
    } else {
      setDeleteConfirmState(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setDeleteConfirmState(false);
    const handles = document.querySelectorAll('.react-flow__handle');
    handles.forEach(handle => {
      if (handle.closest('.react-flow__node').contains(handle)) {
        handle.style.opacity = '0.5';
      }
    });
  };

  return (
    <div 
      ref={nodeRef}
      style={baseStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div style={headerActionsStyle}>
        <button
          style={iconButtonStyle}
          onClick={handleExpand}
          title={!isExpanded ? "Expand" : "Contract"}
        >
          {!isExpanded ? (
            <IoExpandOutline size={18} />
          ) : (
            <IoContractOutline size={18} />
          )}
        </button>
        <button
          style={{
            ...iconButtonStyle,
            color: deleteConfirmState ? '#EF4444' : theme.colors.text.secondary,
            position: 'relative'
          }}
          onClick={handleDeleteClick}
          title={deleteConfirmState ? "Click to confirm delete" : "Delete"}
        >
          <RiDeleteBinLine size={18} />
          {deleteConfirmState && <DeleteConfirmDialog onCancel={() => setDeleteConfirmState(false)} />}
        </button>
      </div>
      <div style={headerStyle}>
        <div style={headerContentStyle}>
          {typeof label === 'string' ? <span>{data?.label || label || type}</span> : label}
          {data?.subtitle && (
            <span style={{ 
              fontSize: '0.75rem', 
              color: theme.colors.text.secondary 
            }}>
              {data.subtitle}
            </span>
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