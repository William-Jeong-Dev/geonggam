import styled, { css } from 'styled-components';
import { theme } from '../../styles/GlobalStyles';

interface ButtonProps {
  $variant?: 'primary' | 'secondary' | 'outline';
  $size?: 'small' | 'medium' | 'large';
  $fullWidth?: boolean;
}

const variants = {
  primary: css`
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    border: 2px solid ${theme.colors.primary};

    &:hover:not(:disabled) {
      background-color: transparent;
      color: ${theme.colors.primary};
    }
  `,
  secondary: css`
    background-color: ${theme.colors.secondary};
    color: ${theme.colors.white};
    border: 2px solid ${theme.colors.secondary};

    &:hover:not(:disabled) {
      background-color: transparent;
      color: ${theme.colors.secondary};
    }
  `,
  outline: css`
    background-color: transparent;
    color: ${theme.colors.primary};
    border: 2px solid ${theme.colors.primary};

    &:hover:not(:disabled) {
      background-color: ${theme.colors.primary};
      color: ${theme.colors.white};
    }
  `,
};

const sizes = {
  small: css`
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  `,
  medium: css`
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  `,
  large: css`
    padding: 1rem 2rem;
    font-size: 1.125rem;
  `,
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border-radius: 0;
  transition: all ${theme.transitions.default};
  cursor: pointer;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};

  ${props => variants[props.$variant || 'primary']}
  ${props => sizes[props.$size || 'medium']}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: transparent;
  color: ${theme.colors.primary};
  transition: background-color ${theme.transitions.default};

  &:hover {
    background-color: ${theme.colors.backgroundAlt};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
