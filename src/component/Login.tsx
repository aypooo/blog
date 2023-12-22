import React, { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { isLoggedInState, userState } from '../recoil';
import LoginForm from './LoginForm';
import { setPersistence, signInWithEmailAndPassword, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { readUserData } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navgate = useNavigate()
  const [user, setUser] = useRecoilState(userState);
  const  setisLoggedIn = useSetRecoilState(isLoggedInState);

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
    <div>
        <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default Login;