import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn' 
    }
  }
};

const modalVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    y: 40,
    rotateX: 15
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    rotateX: 5,
    transition: {
      duration: 0.25,
      ease: 'easeIn'
    }
  }
};

const StyledAlertModal = ({ isOpen, onClose, title, message, type = 'success' }) => {
  if (!isOpen) return null;

  const getIconByType = () => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '✅';
    }
  };

  const getColorByType = () => {
    switch (type) {
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'info':
        return '#3B82F6';
      default:
        return '#10B981';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(17, 24, 39, 0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
              padding: '20px'
            }}
            onClick={onClose}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '32px',
                width: '800px',
                minHeight: '250px',
                maxHeight: '80vh',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                marginBottom: '24px',
                borderBottom: '2px solid rgba(0, 0, 0, 0.06)',
                paddingBottom: '20px',
                flexShrink: 0
              }}>
                <span style={{ 
                  fontSize: '28px', 
                  marginRight: '16px',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                }}>
                  {getIconByType()}
                </span>
                <h2 style={{ 
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: '600',
                  color: getColorByType(),
                  flex: 1,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}>
                  {title}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  style={{
                    background: 'rgba(0, 0, 0, 0.05)',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6B7280',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ×
                </motion.button>
              </div>
              
              <div style={{
                color: '#374151',
                fontSize: '16px',
                lineHeight: '1.6',
                marginBottom: '24px',
                overflowY: 'auto',
                flex: 1,
                padding: '0 4px',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
              }}>
                {message}
              </div>

              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '120px',
                  padding: '12px 24px',
                  background: getColorByType(),
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  flexShrink: 0,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  margin: '0 auto'
                }}
                onClick={onClose}
              >
                Got it
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StyledAlertModal; 