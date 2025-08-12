import type React from 'react';
import './button.css';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

export const Button = ({
  children,
  onClick,
  disabled,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`button ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};
