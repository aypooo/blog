import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    return (
        <span  className='author' onClick={()=> navigate(`/${children}`)}>
            {children}
        </span>
    );
};

export default UserProfile;