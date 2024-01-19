import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userState, isLoggedInState } from '../recoil';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

type LogoutProps = {
    className?: string; // 클래스 이름을 받아올 수 있도록 정의
  }
  
  const Logout: React.FC<LogoutProps> = ({ className }) => {
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userState);
    const [isLoggedIn, setisLoggedIn] = useRecoilState(isLoggedInState);
  
    const handleLogout = async () => {
      if (isLoggedIn) {
        try {
          await auth.signOut();
          setUser({ uid: '', email: '', name: '' });
          setisLoggedIn(false);
          navigate('/', { replace: true });
        } catch (error) {
          console.error('로그아웃 에러:', error);
        }
      }
    };
  
    return (
      <>
        <Button className={className} label='로그아웃' size='m' onClick={handleLogout} />
      </>
    );
  };
  
  export default Logout;