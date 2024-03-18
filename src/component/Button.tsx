import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps {
  label: string;
  size?: 's' | 'm' | 'l' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
  color?:string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, size = 'm', isLoading = false, fullWidth = false, className, color, onClick }) => {
  const classNames = `button ${size} ${fullWidth ? 'full-width' : ''} ${className ? className: ''} ${isLoading ? 'loading' : ''}`;

  return (
    <button style={{color:`${color}`, border:`1px solid ${color}`}} className={classNames} onClick={onClick} disabled={isLoading}>
      {isLoading ? <LoadingSpinner size="10px" loading={isLoading} />: label}
    </button>
  );
};

export default Button;