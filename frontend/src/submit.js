// submit.js

import React from 'react';
import { theme } from './styles/theme';

export const SubmitButton = () => {
    const buttonStyle = {
        padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
        background: theme.colors.primary,
        color: 'white',
        border: 'none',
        borderRadius: theme.borderRadius.md,
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: theme.shadows.md,
        '&:hover': {
            background: '#1d4ed8', // Darker blue
            transform: 'translateY(-1px)',
            boxShadow: theme.shadows.lg
        },
        '&:active': {
            transform: 'translateY(0)',
        }
    };

    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.md,
        background: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows.lg,
        border: `1px solid ${theme.colors.border}`
    };

    return (
        <div style={containerStyle}>
            <button style={buttonStyle} type="submit">
                Submit Pipeline
            </button>
        </div>
    );
};
