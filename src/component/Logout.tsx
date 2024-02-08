import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userState, isLoggedInState, userBookmarkState } from '../recoil';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

  const Logout: React.FC = () => {
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userState);
    const setuserBookmark = useSetRecoilState(userBookmarkState);
    const [isLoggedIn, setisLoggedIn] = useRecoilState(isLoggedInState);

    const handleLogout = async () => {
      if (isLoggedIn) {
        try {
          await auth.signOut();
          setUser({ uid: '', email: '', name: '' });
          setisLoggedIn(false);
          setuserBookmark([])
          navigate('/', { replace: true });
        } catch (error) {
          console.error('로그아웃 에러:', error);
        }
      }
    };
  
    return (
      <>
        <span onClick={handleLogout} >로그아웃</span>
      </>
    );
  };
  
  export default Logout;