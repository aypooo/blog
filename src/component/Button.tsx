import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    size?: 's' | 'm' | 'l'; // 추가: 사이즈 옵션
  }
  
  const Button: React.FC<ButtonProps> = ({ onClick, label ,className, size = 'm', ...rest }) => {
  
    return (
      <button className={`button ${className}-${size}`} onClick={onClick} {...rest}>
        {label}
      </button>
    );
  };
  
  export default Button;