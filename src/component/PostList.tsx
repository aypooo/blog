import React from 'react';
import {  useSetRecoilState } from 'recoil';
import { Post, selectedPostState } from '../recoil';
import { Link, useNavigate } from 'react-router-dom';
import TimeAgoComponent from './TimeAgoComponent ';

type PostListProps = {
    posts: Post[];
    title: string
}
const PostList: React.FC<PostListProps> = ({ posts, title }) => {
    const navigate = useNavigate();
    const setSelectedPost = useSetRecoilState(selectedPostState);
    const handlePostClick = (selectedPost: Post) => {
        setSelectedPost(selectedPost);
        navigate(`/${selectedPost.author}/${selectedPost.postId}`);
    };

    return (
        <div>
            <h2>{title}</h2>
            <Link to="/write"> 글쓰기</Link>
            <ul>
                {posts.map((post, index) => (
                    <li key={index} onClick={() => handlePostClick(post)}>
                        <h3>{post.title}</h3>
                        {/* <p>{post.content}</p> */}
                        <p>작성자 {post.author}</p>
                        <p>좋아요 {post.likes}</p>
                        <p>작성일자 <TimeAgoComponent timestamp={post.createAt}/></p>
                        <p>{post.comments ? Object.keys(post.comments).length : 0}개의 댓글</p>
                    </li>
                ))}
            </ul>
  
        </div>
    );
};

export default PostList;