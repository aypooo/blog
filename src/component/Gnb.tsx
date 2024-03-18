import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isLoggedInState, userState } from '../recoil';
import UserProfile from './UserProfile';
import Button from './Button';

const Gnb = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const user = useRecoilValue(userState);
  return (
    <div className="gnb">
      <div className='gnb__layout'>
        <div className='gnb__layout__left'>
            <Link to="/" className="gnb__link">
              <div className="gnb__layout__left__logo"></div>
            </Link>
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