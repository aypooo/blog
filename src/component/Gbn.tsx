import { Link } from 'react-router-dom';
const Gbn = () => {
    return (
        <div>
            <Link to="/">홈</Link>
            <Link to="/mypage"> 내정보</Link>

            <Link to="/userpost"> 내글</Link>
            <Link to="/login">로그인</Link>
        </div>
    );
};

export default Gbn