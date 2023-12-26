import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isLoggedInState, userState } from '../recoil';
import Logout from './Logout';
const Gnb = () => {
    const isLoggedIn = useRecoilValue(isLoggedInState);
    const user = useRecoilValue(userState)
    return (
        <div>
            <Link to="/">홈</Link>
            {isLoggedIn ? (
                <>
                <Link to="/mypage"> 내정보</Link>
                <Logout/>
                </>
            ):(
                <Link to="/login">로그인</Link>
            )}
            
        </div>
    );
};

export default Gnb;