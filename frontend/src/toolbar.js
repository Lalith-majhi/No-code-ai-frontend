// toolbar.js

import React, { useState } from 'react';
import { nodeDefinitions } from './config/nodeDefinitions';
import { theme } from './styles/theme';
import { IoSearchOutline } from 'react-icons/io5';
import { 
  FiFilter,
  FiTerminal
} from 'react-icons/fi';
import { 
  BsTranslate, 
  BsImage,
  BsBoxArrowInRight,
  BsBoxArrowLeft
} from 'react-icons/bs';
import { 
  TbMathFunction, 
  TbPrompt,
  TbTextRecognition
} from 'react-icons/tb';
import { HiOutlineCpuChip } from 'react-icons/hi2';

const Toolbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredNode, setHoveredNode] = useState(null);

  const onDragStart = (event, nodeType) => {
    const nodeData = nodeDefinitions[nodeType];
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: nodeType,
      data: nodeData
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const toolbarStyle = {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    zIndex: 4,
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '18px 28px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    flexDirection: 'column',
    gap: '22px'
  };

  const searchContainerStyle = {
    position: 'relative',
    width: '158px',
    display: 'flex',
    alignItems: 'center'
  };

  const searchIconStyle = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#000000',
    fontSize: '22px',
    transition: 'all 0.3s ease',
    opacity: '0.85',
    pointerEvents: 'none',
    zIndex: 2,
    strokeWidth: '2.5'
  };

  const searchStyle = {
    width: '100%',
    padding: '8px 16px 8px 42px',
    border: '2px solid rgba(0, 0, 0, 0.08)',
    borderRadius: '12px',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#000000',
    fontWeight: '500'
  };

  const searchInputStyle = {
    ...searchStyle,
    '::placeholder': {
      color: 'rgba(0, 0, 0, 0.4)',
      fontWeight: '400'
    }
  };

  const nodesContainerStyle = {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
    alignItems: 'center'
  };

  const nodeButtonStyle = (type) => ({
    width: '60px',
    height: '70px',
    padding: '8px',
    background: hoveredNode === type ? 'rgba(100, 102, 241, 0.03)' : '#ffffff',
    border: `2px solid ${hoveredNode === type ? '#6466f1' : 'rgba(0, 0, 0, 0.08)'}`,
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: hoveredNode === type ? '#6466f1' : '#000000',
    fontSize: '0.7rem',
    position: 'relative',
    textAlign: 'center',
    transform: hoveredNode === type ? 'translateY(-2px) scale(1.02)' : 'none',
    boxShadow: hoveredNode === type 
      ? '0 8px 16px rgba(100, 102, 241, 0.12)' 
      : '0 2px 4px rgba(0, 0, 0, 0.02)',
    userSelect: 'none'
  });

  const iconContainerStyle = (type) => ({
    width: '28px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: hoveredNode === type ? '#6466f1' : 'rgba(0, 0, 0, 0.03)',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    color: hoveredNode === type ? 'white' : '#000000',
    fontSize: '0.9rem',
    transform: hoveredNode === type ? 'scale(1.05)' : 'scale(1)',
  });

  const labelStyle = {
    fontWeight: '600',
    fontSize: '0.7rem',
    lineHeight: '1.2',
    color: 'inherit',
    transition: 'all 0.3s ease',
    opacity: '0.9'
  };

  const filteredNodes = Object.entries(nodeDefinitions).filter(([_, def]) =>
    def.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

    return (
    <div style={toolbarStyle}>
      <div style={searchContainerStyle}>
        <IoSearchOutline style={searchIconStyle} />
        <input
          type="text"
          placeholder="Search Nodes "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = '#6466f1';
            e.target.style.backgroundColor = '#ffffff';
            e.target.style.boxShadow = '0 0 0 4px rgba(100, 102, 241, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = theme.colors.border;
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            e.target.style.boxShadow = 'none';
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#ffffff';
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            if (document.activeElement !== e.target) {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
              e.target.style.borderColor = theme.colors.border;
              e.target.style.boxShadow = 'none';
            }
          }}
        />
      </div>
      <div style={nodesContainerStyle}>
        {filteredNodes.map(([type, def]) => (
          <div
            key={type}
            style={nodeButtonStyle(type)}
            onDragStart={(e) => onDragStart(e, type)}
            onMouseEnter={() => setHoveredNode(type)}
            onMouseLeave={() => setHoveredNode(null)}
            draggable
          >
            <div style={iconContainerStyle(type)}>
              {getNodeIcon(type)}
            </div>
            <span style={labelStyle}>{def.label}</span>
          </div>
        ))}
            </div>
        </div>
    );
};

// Helper function to render node icons
const getNodeIcon = (type) => {
  const iconMap = {
    'InputNode': <BsBoxArrowInRight size={19} />,
    'OutputNode': <BsBoxArrowLeft size={19} />,
    'TextNode': <TbTextRecognition size={19} />,
    'LLMNode': <HiOutlineCpuChip size={19} />,
    'MathNode': <TbMathFunction size={19} />,
    'PromptNode': <TbPrompt size={19} />,
    'ImageNode': <BsImage size={19} />,
    'FilterNode': <FiFilter size={19} />,
    'LoggerNode': <FiTerminal size={19} />,
    'TranslationNode': <BsTranslate size={19} />
  };
  
  return iconMap[type] || <BsBoxArrowInRight size={19} />;
};

export default Toolbar;
