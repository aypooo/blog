import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isLoggedInState } from '../recoil';
import Logout from './Logout';
const Gbn = () => {
    const isLoggedIn = useRecoilValue(isLoggedInState);
  
    return (
        <div>
            <Link to="/">홈</Link>
            {isLoggedIn ? (
                <>
                <Link to="/userpost"> 내글</Link>
                <Link to="/mypage"> 내정보</Link>
                <Logout/>
                </>
            ):(
                <Link to="/login">로그인</Link>
            )}
            
        </div>
    );
};

export default Gbn