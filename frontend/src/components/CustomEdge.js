import React, { useState, useEffect, useRef } from 'react';
import { getBezierPath } from 'reactflow';
import { MdClose } from 'react-icons/md';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowDeleteConfirm(false);
      }
    };

    if (showDeleteConfirm) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDeleteConfirm]);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const deleteButtonStyle = {
    position: 'absolute',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    background: '#fff',
    border: `1.5px solid ${showDeleteConfirm ? '#EF4444' : '#6466f1'}`,
    color: showDeleteConfirm ? '#EF4444' : '#6466f1',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    padding: 0,
    zIndex: 10,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    willChange: 'transform, background, color, border'
  };

  const pathStyle = {
    strokeWidth: isHovered ? 2.5 : 2,
    stroke: showDeleteConfirm ? '#EF4444' : '#6466f1',
    strokeDasharray: 'none'
  };

  const handleDeleteClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (showDeleteConfirm) {
      if (data?.onEdgeDelete) {
        data.onEdgeDelete(id);
      }
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <>
      <path
        className="react-flow__edge-path"
        d={edgePath}
        style={pathStyle}
        markerEnd={markerEnd}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        fill="none"
      />
      <foreignObject
        width={40}
        height={40}
        x={labelX - 20}
        y={labelY - 20}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="edge-button-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
          {showDeleteConfirm && (
            <div
              style={{
                position: 'absolute',
                top: '-24px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'white',
                padding: '4px 6px',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.1)',
                zIndex: 9999,
                fontSize: '0.65rem',
                color: '#374151',
                whiteSpace: 'nowrap',
                pointerEvents: 'none'
              }}
            >
              Click again to delete
            </div>
          )}
          <button
            ref={buttonRef}
            style={{
              ...deleteButtonStyle,
              background: isHovered || showDeleteConfirm ? '#EF4444' : '#fff',
              color: isHovered || showDeleteConfirm ? '#fff' : (showDeleteConfirm ? '#EF4444' : '#6466f1'),
              transform: `translate(-50%, -50%) ${isHovered ? 'scale(1.1)' : 'scale(1)'}`,
              opacity: isHovered ? 1 : 0.85,
              transition: 'transform 0.1s ease',
              willChange: 'transform, background, color'
            }}
            onClick={handleDeleteClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title={showDeleteConfirm ? "Click to confirm deletion" : "Delete connection"}
          >
            <MdClose size={10} />
          </button>
        </div>
      </foreignObject>
    </>
  );
};

export default CustomEdge;