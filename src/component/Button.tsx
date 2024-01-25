import React from 'react';
import PropTypes from 'prop-types';

interface ButtonProps {
  label: string;
  size?: 's' | 'm' | 'l' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, size = 'm', isLoading = false, fullWidth = false, onClick }) => {
  const classNames = `button ${size} ${fullWidth ? 'full-width' : ''} ${isLoading ? 'loading' : ''}`;

  return (
    <button className={classNames} onClick={onClick} disabled={isLoading}>
      {isLoading ? 'Loading...' : label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['s', 'm', 'l', 'xl']),
  isLoading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;