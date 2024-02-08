import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps {
  label: string;
  size?: 's' | 'm' | 'l' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, size = 'm', isLoading = false, fullWidth = false, className, onClick }) => {
  const classNames = `button ${className ? className: ''} ${size} ${fullWidth ? 'full-width' : ''} ${isLoading ? 'loading' : ''}`;

  return (
    <button className={classNames} onClick={onClick} disabled={isLoading}>
      {isLoading ? <LoadingSpinner size="10px" loading={isLoading} />: label}
    </button>
  );
};

export default Button;