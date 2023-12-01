import React from 'react';
import { useRecoilState } from 'recoil';
import { isLoggedInState, userState } from '../recoil';
import LoginForm from './LoginForm';
import { browserSessionPersistence, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';

const Login: React.FC = () => {
  const [user,setUser] = useRecoilState(userState);
  const [isLoggedIn,setisLoggedIn] = useRecoilState(isLoggedInState);
  const handleLogin = async (email: string, password: string) => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user && user.email) {
        setUser({uid:user.uid, email:user.email});
        setisLoggedIn(true)
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser({uid:'', email:''})
      setisLoggedIn(false)
      console.log('로그아웃')
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <div>
      {isLoggedIn ? (
          <>
            <div>{user.email}</div>
          <button onClick={handleLogout}>로그아웃</button>
          </>
        ):(
          <>
            <LoginForm onLogin={handleLogin} />
          </>
        )
      }

    </div>
  );
};

export default Login;