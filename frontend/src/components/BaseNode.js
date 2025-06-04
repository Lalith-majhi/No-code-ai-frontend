import React, { useState, useRef, useEffect } from 'react';
import { Handle } from 'reactflow';
import { theme } from '../styles/theme';
import { IoExpandOutline, IoContractOutline } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { MdClose } from 'react-icons/md';
import { BsCircleFill, BsDot } from 'react-icons/bs';

const themeColor = '#6466f1';
const themeColorLight = '#e0e1fc';
const themeColorDark = '#4f46e5';

// Add keyframes for the pulse animation
const pulseAnimation = `
  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(100, 102, 241, 0.4);
    }
    70% {
      transform: scale(1.1);
      box-shadow: 0 0 0 6px rgba(100, 102, 241, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(100, 102, 241, 0);
    }
  }

  @keyframes glow {
    0% {
      opacity: 0.4;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.05);
    }
    100% {
      opacity: 0.4;
      transform: scale(1);
    }
  }

  .react-flow__edge-path {
    stroke: ${themeColor};
    stroke-width: 2;
    stroke-opacity: 0.5;
    stroke-dasharray: 5;
    animation: flowPath 30s linear infinite;
    filter: drop-shadow(0 1px 2px rgba(100, 102, 241, 0.1));
    transition: all 0.3s ease;
  }

  .react-flow__edge:hover .react-flow__edge-path {
    stroke: ${themeColorDark};
    stroke-width: 3;
    stroke-opacity: 0.8;
    filter: drop-shadow(0 2px 4px rgba(100, 102, 241, 0.2));
  }

  .react-flow__edge.selected .react-flow__edge-path {
    stroke: ${themeColorDark};
    stroke-width: 3;
    stroke-opacity: 1;
    stroke-dasharray: none;
    filter: drop-shadow(0 2px 4px rgba(100, 102, 241, 0.3));
  }

  .react-flow__edge.animated .react-flow__edge-path {
    stroke-dasharray: 5;
    animation: flowPath 30s linear infinite;
  }

  @keyframes flowPath {
    0% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: -100;
    }
  }
`;

// Add the style tag to the document
if (!document.getElementById('node-animations')) {
  const styleTag = document.createElement('style');
  styleTag.id = 'node-animations';
  styleTag.innerHTML = pulseAnimation;
  document.head.appendChild(styleTag);
}

// Add gradient backgrounds for different node types
const nodeTypeStyles = {
  default: {
    background: `linear-gradient(145deg, ${themeColorLight}40, ${themeColorLight}20)`,
  },
  input: {
    background: 'linear-gradient(145deg, #f0fdf4, #dcfce7)',
  },
  output: {
    background: 'linear-gradient(145deg, #eff6ff, #dbeafe)',
  },
  llm: {
    background: 'linear-gradient(145deg, #faf5ff, #f3e8ff)',
  },
  math: {
    background: 'linear-gradient(145deg, #fff7ed, #ffedd5)',
  },
  filter: {
    background: 'linear-gradient(145deg, #f8fafc, #f1f5f9)',
  },
  logger: {
    background: 'linear-gradient(145deg, #fdf2f8, #fce7f3)',
  },
  prompt: {
    background: 'linear-gradient(145deg, #ecfeff, #cffafe)',
  },
  translation: {
    background: 'linear-gradient(145deg, #fefce8, #fef9c3)',
  },
  image: {
    background: 'linear-gradient(145deg, #f5f3ff, #ede9fe)',
  }
};

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
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.1)',
        zIndex: 1000,
        fontSize: '0.65rem',
        color: '#374151',
        whiteSpace: 'nowrap',
        animation: 'fadeIn 0.2s ease',
        transform: 'translateY(-4px)',
        transition: 'transform 0.2s ease'
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
    borderRadius: '12px',
    background: 'white',
    border: `1px solid ${isHovered ? themeColor : '#e5e7eb'}`,
    boxShadow: isHovered 
      ? `0 4px 20px rgba(100, 102, 241, 0.1), 0 0 0 2px ${themeColorLight}`
      : '0 4px 6px rgba(0, 0, 0, 0.05)',
    minWidth: '250px',
    width: '250px',
    maxWidth: '250px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    transform: isHovered ? 'translateY(-2px)' : 'none',
    ...style
  };

  const getNodeStyle = (nodeType) => {
    return nodeTypeStyles[nodeType] || nodeTypeStyles.default;
  };

  const headerStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: 'calc(100% + 24px)',
    margin: '-12px -12px 12px -12px',
    padding: '16px 12px 12px 12px',
    borderBottom: !isExpanded ? 'none' : `1px solid ${isHovered ? themeColorLight : '#e5e7eb'}`,
    backgroundColor: 'transparent',
    borderRadius: '10px 10px 0 0',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    ...getNodeStyle(type.toLowerCase()),
    backdropFilter: 'blur(8px)',
    position: 'relative'
  };

  const headerContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '4px',
    padding: '0 32px 0 0',
    position: 'relative',
    zIndex: 1
  };

  const headerActionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    opacity: isHovered ? 1 : 0.7,
    transition: 'all 0.2s ease',
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
      background: themeColorLight,
      color: themeColor
    }
  };

  const handleStyle = (isInput) => ({
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: `2px solid ${themeColor}`,
    background: 'white',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 1,
    cursor: 'crosshair',
    zIndex: 5,
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '6px',
      height: '6px',
      backgroundColor: themeColor,
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.3s ease'
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '36px',
      height: '36px',
      border: `2px solid ${themeColor}`,
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      opacity: 0.2,
      pointerEvents: 'none'
    },
    '&:hover': {
      background: themeColor,
      transform: 'scale(1.1)',
      '&::before': {
        backgroundColor: 'white'
      },
      '&::after': {
        opacity: 0.4,
        transform: 'translate(-50%, -50%) scale(1.1)'
      }
    },
    '&.connecting, &.react-flow__handle-connecting': {
      background: `${themeColor} !important`,
      borderColor: `${themeColorDark} !important`,
      transform: 'scale(1.1)',
      '&::before': {
        backgroundColor: 'white !important'
      },
      '&::after': {
        opacity: '0.6 !important',
        transform: 'translate(-50%, -50%) scale(1.2)',
        borderColor: `${themeColor} !important`
      }
    },
    '&.connected, &.react-flow__handle-valid': {
      background: `${themeColor} !important`,
      borderColor: `${themeColorDark} !important`,
      '&::before': {
        backgroundColor: 'white !important'
      },
      '&::after': {
        opacity: '0.4 !important',
        borderColor: `${themeColor} !important`
      }
    }
  });

  const handleWrapperStyle = (isInput) => ({
    position: 'absolute',
    [isInput ? 'left' : 'right']: '-18px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  });

  const handleLabelStyle = (isInput) => ({
    position: 'absolute',
    fontSize: '0.7rem',
    fontWeight: '500',
    color: theme.colors.text.secondary,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: isHovered ? 0.9 : 0,
    transform: isHovered 
      ? 'translateY(-50%) translateX(0)' 
      : `translateY(-50%) translateX(${isInput ? '-8px' : '8px'})`,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    backgroundColor: isHovered ? 'white' : 'transparent',
    padding: isHovered ? '2px 6px' : '2px',
    borderRadius: '4px',
    boxShadow: isHovered ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
  });

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

  // Add custom CSS to handle React Flow's connection state
  const customStyles = `
    .react-flow__handle {
      opacity: 1 !important;
    }
    .react-flow__connection-path {
      stroke: ${themeColor} !important;
      stroke-width: 2 !important;
      stroke-opacity: 0.75;
    }
    .react-flow__edge-path {
      stroke: ${themeColor} !important;
      stroke-width: 2 !important;
    }
    .react-flow__edge.selected .react-flow__edge-path {
      stroke: ${themeColorDark} !important;
      stroke-width: 3 !important;
    }
    .react-flow__handle.source-handle {
      background: ${themeColor} !important;
    }
    .react-flow__handle.source-handle::before {
      background: white !important;
    }
    .react-flow__connection {
      pointer-events: none;
    }
    .react-flow__edge.animated path {
      stroke-dasharray: 5;
      animation: flowPath 1s linear infinite;
    }
    @keyframes flowPath {
      to {
        stroke-dashoffset: -10;
      }
    }
  `;

  // Add the custom styles to the document
  useEffect(() => {
    const styleId = 'react-flow-custom-styles';
    if (!document.getElementById(styleId)) {
      const styleSheet = document.createElement('style');
      styleSheet.id = styleId;
      styleSheet.innerHTML = customStyles;
      document.head.appendChild(styleSheet);
    }

    // Add connection listeners
    const handleConnectionChange = (event) => {
      const handles = document.querySelectorAll('.react-flow__handle');
      handles.forEach(handle => {
        if (event.type === 'connectStart') {
          if (handle === event.sourceHandle || handle.contains(event.sourceHandle)) {
            handle.classList.add('connecting');
          }
        } else if (event.type === 'connectEnd') {
          handle.classList.remove('connecting');
          if (event.target && (handle === event.target || handle.contains(event.target))) {
            handle.classList.add('connected');
            setTimeout(() => handle.classList.remove('connected'), 300);
          }
        }
      });
    };

    document.addEventListener('connectStart', handleConnectionChange);
    document.addEventListener('connectEnd', handleConnectionChange);

    return () => {
      document.removeEventListener('connectStart', handleConnectionChange);
      document.removeEventListener('connectEnd', handleConnectionChange);
    };
  }, []);

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
          <span style={{
            fontSize: '0.9rem',
            fontWeight: '600',
            color: isHovered ? themeColor : '#374151',
            transition: 'color 0.2s ease',
            letterSpacing: '0.01em'
          }}>
            {data?.label || label || type}
          </span>
          {data?.subtitle && (
            <span style={{ 
              fontSize: '0.75rem', 
              color: theme.colors.text.secondary,
              opacity: 0.8,
              fontWeight: '400'
            }}>
              {data.subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Input Handles */}
      {(data?.inputs || inputs).map((input, index, array) => (
        <React.Fragment key={`input-${index}`}>
          <div style={{
            ...handleWrapperStyle(true),
            top: `${((index + 1) * 100) / (array.length + 1)}%`,
            transform: 'translateY(-50%)'
          }}>
            <Handle
              type="target"
              position="left"
              id={input}
              style={{
                ...handleStyle(true),
                position: 'relative',
                top: 'unset',
                left: 'unset',
                transform: 'none'
              }}
            />
          </div>
          <div
            style={{
              ...handleLabelStyle(true),
              left: '24px',
              top: `${((index + 1) * 100) / (array.length + 1)}%`,
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
          <div style={{
            ...handleWrapperStyle(false),
            top: `${((index + 1) * 100) / (array.length + 1)}%`,
            transform: 'translateY(-50%)'
          }}>
            <Handle
              type="source"
              position="right"
              id={output}
              style={{
                ...handleStyle(false),
                position: 'relative',
                top: 'unset',
                right: 'unset',
                transform: 'none'
              }}
            />
          </div>
          <div
            style={{
              ...handleLabelStyle(false),
              right: '24px',
              top: `${((index + 1) * 100) / (array.length + 1)}%`,
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