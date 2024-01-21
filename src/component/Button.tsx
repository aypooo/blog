import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    size?: 's' | 'm' | 'l'; // 추가: 사이즈 옵션
  }
  
  const Button: React.FC<ButtonProps> = ({ onClick, label ,className, size, ...rest }) => {
  
    return (
      <button className={`button ${size ? `button-${size}`:''} ${className ? (size ? `${className}-${size}`:className):('')} `} onClick={onClick} {...rest}>
        {label}
      </button>
    );
  };
  
  export default Button;