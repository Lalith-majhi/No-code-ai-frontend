import React from 'react';
import { theme } from '../styles/theme';

export const AlertModal = ({ isOpen, onClose, title, message, type = 'success' }) => {
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

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    };

    const modalStyle = {
        backgroundColor: 'white',
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        maxWidth: '500px',
        width: '90%',
        boxShadow: theme.shadows.xl,
        position: 'relative',
        animation: 'slideIn 0.3s ease-out',
    };

    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        padding: theme.spacing.sm,
        borderBottom: `1px solid ${theme.colors.border}`,
    };

    const titleStyle = {
        margin: 0,
        fontSize: '1.25rem',
        fontWeight: '600',
        color: theme.colors.text,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
    };

    const messageStyle = {
        whiteSpace: 'pre-line',
        margin: `${theme.spacing.md} 0`,
        color: theme.colors.text,
        fontSize: '1rem',
        lineHeight: '1.5',
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: theme.spacing.sm,
        right: theme.spacing.sm,
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: theme.colors.text,
        padding: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: theme.colors.background,
            transform: 'scale(1.1)',
        },
    };

    const buttonStyle = {
        padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
        backgroundColor: theme.colors.primary,
        color: 'white',
        border: 'none',
        borderRadius: theme.borderRadius.md,
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: '#1d4ed8',
            transform: 'translateY(-1px)',
        },
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
                <div style={headerStyle}>
                    <h2 style={titleStyle}>
                        {getIconByType()} {title}
                    </h2>
                </div>
                <div style={messageStyle}>{message}</div>
                <button style={buttonStyle} onClick={onClose}>
                    Got it
                </button>
                <button style={closeButtonStyle} onClick={onClose}>
                    ×
                </button>
            </div>
            <style>
                {`
                    @keyframes slideIn {
                        from {
                            transform: translateY(-20px);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                `}
            </style>
        </div>
    );
}; 