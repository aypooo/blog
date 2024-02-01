import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { isLoggedInState, userState } from '../recoil';

import { setPersistence, signInWithEmailAndPassword, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { readUserData } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../component/LoginForm';

const Login: React.FC = () => {
  const navgate = useNavigate()
  const [user, setUser] = useRecoilState(userState);
  const  setisLoggedIn = useSetRecoilState(isLoggedInState);
  const [error, setError] = useState<string | null>(null);
  
  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (user && user.email) {
        const userData = await readUserData(user.uid!)
        setUser({ uid: userData!.uid, email: userData!.email!, name: userData!.name });
        setisLoggedIn(true);
        navgate("/")
      }
    } catch (error) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
      console.error('로그인 에러:', error);
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
      <LoginForm onLogin={handleLogin} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
