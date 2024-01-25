import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logout from '../component/Logout';
import { useRecoilValue } from 'recoil';
import { isLoggedInState, userState } from '../recoil';
import Button from '../component/Button';
import UserPostPage from '../component/UserPostPage';
import Dropdown from '../component/DropDown';

const UserPage: React.FC = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const user = useRecoilValue(userState);
  useEffect(()=>{
    window.scroll(0,0)
  },[user.name])
  return (
    <div className="user-page">
      <div className="layout">
        {isLoggedIn ? (
          <div className="user-page__profile">
            <div className="user-page__profile__info">
              <span>{user.name}</span>
              <Dropdown label="⋮">
                <Link to="/profile">
                  <Button label="프로필 수정" />
                </Link>
                <Logout/>
              </Dropdown>
            </div>
          </div>
        ) : (
          <div className="user-page__profile">
            <span>{user.name}</span>
          </div>
        )}
        <UserPostPage />
      </div>
    </div>
  );
};

export default UserPage;