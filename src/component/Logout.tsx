import React from 'react';
import { useRecoilState } from 'recoil';
import { userState, isLoggedInState } from '../recoil';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';

const Logout: React.FC = () => {
    const navgate = useNavigate()
    const [user, setUser] = useRecoilState(userState);
    const [isLoggedIn, setisLoggedIn] = useRecoilState(isLoggedInState);

    const handleLogout = async () => {
        if(isLoggedIn){
            try {
                await auth.signOut();
                setUser({ uid: '', email: '', name: '' });
                setisLoggedIn(false);
                navgate('/',{replace:true})
            } catch (error) {
                console.error('로그아웃 에러:', error);
            }
        }
    };

    return (
        <div className='logout'>
            <div className='logout__name'><UserProfile>{user.name ? user.name : 'username'}</UserProfile></div>
            <button className='logout__button' onClick={handleLogout}>로그아웃</button>
        </div>
    );
    };

export default Logout;