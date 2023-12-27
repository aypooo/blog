import React from 'react';
import UserPostPage from './UserPostPage';
import { Link } from 'react-router-dom';

const UserPage = () => {
    return (
        <div>
            <Link to="/mypage">내정보</Link>
            <UserPostPage></UserPostPage>
        </div>
    );
};

export default UserPage;