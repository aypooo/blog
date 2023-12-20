import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userState, Post, selectedPostState, postsState, userPostsSelector, selectedUserState } from '../recoil';
import { readPostData } from '../firebase/post';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import TimeAgoComponent from './TimeAgoComponent ';

const POSTS_PER_PAGE = 5; // 페이지당 포스트 수

const PostList: React.FC = () => {
    const {user} = useParams()
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useRecoilState(selectedUserState);
    const userPosts = useRecoilValue(selectedUser ? userPostsSelector : postsState);
    const setSelectedPost = useSetRecoilState(selectedPostState);

    // Pagination logic
    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    const postsArray = userPosts ? Object.values(userPosts) : [];
    const currentPosts = postsArray.reverse().slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handlePostClick = (selectedPost: Post) => {
        setSelectedPost(selectedPost);
        navigate(`/${selectedPost.author}/${selectedPost.postId}`);
    };

    useEffect(() => {
        setSelectedUser(user!)
        setCurrentPage(1);
    }, [selectedUser, setSelectedUser, user]);

    return (
        <div>
            <h2>Your Posts</h2>
            <Link to="/write"> 글쓰기</Link>
            <ul>
                {currentPosts.map((post, index) => (
                    <li key={index} onClick={() => handlePostClick(post)}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <p>작성자 {post.author}</p>
                        <p>좋아요 {post.likes}</p>
                        <p>작성일자 <TimeAgoComponent timestamp={post.createAt}/></p>
                        <p>{post.comments ? Object.keys(post.comments).length : 0}개의 댓글</p>
                    </li>
                ))}
            </ul>
            <Pagination
                activePage={currentPage}
                itemsCountPerPage={POSTS_PER_PAGE}
                totalItemsCount={Object.keys(userPosts).length}
                onChange={paginate}
            />
        </div>
    );
};

export default PostList;