import React, { ReactNode, useRef, useEffect, useState } from 'react';
import useClickOutside from '../hook/useClickOutside';
import Button from './Button';

interface DropdownProps {
  label: string;
  children: ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ label, children }) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useClickOutside(dropdownRef, () => setModalOpen(false));

  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setModalOpen(!modalOpen);
  };

  return (
    <div className="drop-down">
      {/* className="boder-none drop-down" */}
      <span onClick={handleButtonClick}>{label}</span>
      {modalOpen ? (
        <div className="drop-down__content" ref={dropdownRef}>
          <div className="drop-down__content__item">{children}</div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Dropdown;