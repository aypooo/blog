import React from 'react';
import PostList from '../component/PostList';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userPostsSelector, userState } from '../recoil';

const UserPostPage = () => {
    const { uid } = useRecoilValue(userState);
    const userPosts = useRecoilValue(userPostsSelector);
    if(!uid) return <>로그인해주세요</>
    if(!userPosts) return (
        <div>
            <span>작성한 글이 없습니다.</span>
            <Link to="/write"> 글쓰기</Link>
        </div>    
    )

    return (
        <div>
            <PostList/>
        </div>
    );
};

export default UserPostPage;