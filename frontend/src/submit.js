// submit.js

import React, { useState } from 'react';
import { useReactFlow } from 'reactflow';
import * as Dialog from '@radix-ui/react-dialog';
import { TbCircuitDiode, TbPointFilled, TbArrowsJoin2, TbGraph } from 'react-icons/tb';

export const submitPipeline = async (nodes, edges, setIsOpen, setAnalysisResult) => {
  try {
    const response = await fetch('http://localhost:8000/pipelines/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodes, edges }),
    });

    const result = await response.json();
    setAnalysisResult(result);
    setIsOpen(true);
  } catch (error) {
    console.error('Pipeline submission failed', error);
    setAnalysisResult({ error: true });
    setIsOpen(true);
  }
};

export const SubmitButton = () => {
  const { getNodes, getEdges } = useReactFlow();
  const [isOpen, setIsOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleSubmit = () => {
    const nodes = getNodes();
    const edges = getEdges();
    submitPipeline(nodes, edges, setIsOpen, setAnalysisResult);
  };

  return (
    <>
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: '#6466f1',
          color: 'white',
          padding: '10px 18px',
          borderRadius: '8px',
          border: 'none',
          fontWeight: 600,
          fontSize: '14px',
          marginTop: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 6px rgba(100, 102, 241, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
      >
        Analyze Pipeline
      </button>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              position: 'fixed',
              inset: 0,
              animation: 'overlayShow 250ms cubic-bezier(0.16, 1, 0.3, 1)',
              backdropFilter: 'blur(8px)',
              zIndex: 9998
            }}
          />
          <Dialog.Content
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(100, 102, 241, 0.12)',
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '75%',
              maxWidth: '380px',
              maxHeight: '75vh',
              padding: '20px',
              animation: 'contentShow 350ms cubic-bezier(0.16, 1, 0.3, 1)',
              zIndex: 9999,
              overflowY: 'auto',
              border: '1px solid rgba(100, 102, 241, 0.15)',
              transition: 'all 0.3s ease'
            }}
          >
            <Dialog.Close asChild>
              <button
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  backgroundColor: 'rgba(243, 244, 246, 0.8)',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(4px)',
                  fontSize: '16px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#fee2e2';
                  e.target.style.color = '#dc2626';
                  e.target.style.transform = 'scale(1.1) rotate(90deg)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(243, 244, 246, 0.8)';
                  e.target.style.color = '#6b7280';
                  e.target.style.transform = 'scale(1) rotate(0deg)';
                }}
              >
                ✕
              </button>
            </Dialog.Close>
            {analysisResult?.error ? (
              <div style={{ 
                textAlign: 'center', 
                color: '#ef4444',
                padding: '12px',
                animation: 'fadeIn 0.3s ease'
              }}>
                <h2 style={{ 
                  margin: '0 0 12px', 
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '24px' }}>❌</span>
                  Analysis Failed
                </h2>
                <p style={{ 
                  margin: '0', 
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.6'
                }}>
                  Please try again. If the issue persists, check your pipeline configuration.
                </p>
              </div>
            ) : (
              <div style={{ padding: '8px 0' }}>
                <h2 style={{ 
                  margin: '0 0 20px', 
                  color: '#000000', 
                  fontSize: '20px', 
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: '600',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  paddingRight: '20px',
                  borderBottom: '2px solid rgba(100, 102, 241, 0.1)',
                  paddingBottom: '14px'
                }}>
                  <TbCircuitDiode size={24} color="#6466f1" style={{
                    animation: 'pulse 2s infinite',
                    filter: 'drop-shadow(0 2px 4px rgba(100, 102, 241, 0.2))'
                  }} />
                  Pipeline Analysis Results
                </h2>
                <div style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.5',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  color: '#333333',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ 
                    padding: '10px',
                    backgroundColor: 'rgba(100, 102, 241, 0.05)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    animation: 'slideIn 0.4s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <TbPointFilled size={18} color="#6466f1" />
                      <strong style={{ fontWeight: '600' }}>Nodes</strong>
                    </div>
                    <span style={{ 
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#6466f1',
                      backgroundColor: 'white',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(100, 102, 241, 0.1)',
                      minWidth: '40px',
                      textAlign: 'center'
                    }}>{analysisResult?.num_nodes}</span>
                  </div>
                  <div style={{ 
                    padding: '10px',
                    backgroundColor: 'rgba(100, 102, 241, 0.05)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    animation: 'slideIn 0.5s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <TbArrowsJoin2 size={18} color="#6466f1" />
                      <strong style={{ fontWeight: '600' }}>Edges</strong>
                    </div>
                    <span style={{ 
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#6466f1',
                      backgroundColor: 'white',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(100, 102, 241, 0.1)',
                      minWidth: '40px',
                      textAlign: 'center'
                    }}>{analysisResult?.num_edges}</span>
                  </div>
                  <div style={{ 
                    padding: '10px',
                    backgroundColor: 'rgba(100, 102, 241, 0.05)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    animation: 'slideIn 0.6s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <TbGraph size={18} color="#6466f1" style={{
                        transform: analysisResult?.is_dag ? 'none' : 'rotate(180deg)',
                        transition: 'transform 0.3s ease'
                      }} />
                      <strong style={{ fontWeight: '600' }}>Is DAG</strong>
                    </div>
                    <span style={{ 
                      fontSize: '14px',
                      fontWeight: '500',
                      backgroundColor: analysisResult?.is_dag ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: analysisResult?.is_dag ? '#16a34a' : '#dc2626',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      minWidth: '40px',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}>
                      {analysisResult?.is_dag ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

// Add these keyframe animations at the end of the file
const style = document.createElement('style');
style.textContent = `
  @keyframes overlayShow {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes contentShow {
    from { 
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.96);
    }
    to { 
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);
