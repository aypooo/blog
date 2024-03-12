import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { isLoggedInState, userState } from '../recoil';

import { setPersistence, signInWithEmailAndPassword, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../component/LoginForm';

const Login: React.FC = () => {
  const navgate = useNavigate()
  const [user, setUser] = useRecoilState(userState);
  const  setisLoggedIn = useSetRecoilState(isLoggedInState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setloading] = useState(false);
  const handleLogin = async (email: string, password: string) => {
    try {
      setloading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;
      if (user && user.email) {
        setisLoggedIn(true);
      }
      setloading(false)
      navgate("/")
    } catch (error) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
      console.error('로그인 에러:', error);
      setloading(false)
    }
  };
  useEffect(() => {
    const initializeAuthPersistence = async () => {
      try {
        // Firebase Authentication의 지속성을 로컬로 설정
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        console.error('Auth persistence 설정 에러:', error);
      }
    };

    initializeAuthPersistence();
  }, [setUser, user.email, user.uid]);
  return (
   <div className='login'>
      <LoginForm onLogin={handleLogin} error={error!} loading={loading} />
    </div>
  );
};

export default Login;
