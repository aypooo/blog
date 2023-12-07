import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { isLoggedInState, userState } from '../recoil';
import LoginForm from './LoginForm';
import { setPersistence, signInWithEmailAndPassword, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../firebase/firebase';

const Login: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const [isLoggedIn, setisLoggedIn] = useRecoilState(isLoggedInState);

  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user && user.email) {
        setUser({ uid: user.uid, email: user.email });
        setisLoggedIn(true);
      }
    } catch (error) {
      console.error('로그인 에러:', error);
    }
  };


  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser({ uid: '', email: '' });
      setisLoggedIn(false);
    } catch (error) {
      console.error('로그아웃 에러:', error);
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
      {isLoggedIn ? (
        <>
          <div>{user.email}</div>
          <button onClick={handleLogout}>로그아웃</button>
        </>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default Login;