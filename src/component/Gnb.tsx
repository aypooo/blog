import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isLoggedInState } from '../recoil';
import Logout from './Logout';

const Gnb = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);

  return (
    <div className="gnb">
        <div className='gnb__left'>
            <Link to="/" className="gnb__link">홈</Link>
        </div>
      {isLoggedIn ? (
        <div className='gnb__right'>
          <Logout />
        </div>
      ) : (
        <div className='gnb__right'>
        <Link to="/login" className="gnb__link">로그인</Link>
        </div>
      )}
    </div>
  );
};

export default Gnb;