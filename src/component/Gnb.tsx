import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isLoggedInState, userState } from '../recoil';
import Logout from './Logout';
import UserProfile from './UserProfile';
import Button from './Button';

const Gnb = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [user, setUser] = useRecoilState(userState);
  return (
    <div className="gnb">
      <div className='gnb__layout'>
        <div className='gnb__layout__left'>
            <Link to="/" className="gnb__link">홈</Link>
        </div>
      {isLoggedIn ? (
        <div className='gnb__layout__right'>
          <UserProfile>{user.name ? user.name : 'username'}</UserProfile>
          <Link to="/write">
            <Button size="s" label="글쓰기" />
          </Link>
        </div>
      ) : (
        <div className='gnb__layout__right'>
        <Link to="/login" className="gnb__link">로그인</Link>
        </div>
      )}
      </div>
    </div>
  );
};

export default Gnb;