import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userPostsSelector, singlePostState, selectedPostIdState } from '../recoil';

const PostListPage: React.FC = () => {
    const userPosts = useRecoilValue(userPostsSelector);
    const setSinglePost = useSetRecoilState(singlePostState);
    const setSelectedPostId = useSetRecoilState(selectedPostIdState);

    const handlePostClick = (postId: string) => {
        const selectedPost = userPosts.find((post) => post.postId === postId);
        setSinglePost(selectedPost || null);
        setSelectedPostId(postId);
    };

    return (
    <div>
        <h2>Your Posts</h2>
        <ul>
        {userPosts.map((post) => (
            <li key={post.postId} onClick={() => handlePostClick(post.postId)}>
            {post.title}
            </li>
        ))}
        </ul>
    </div>
    );
};

export default PostListPage;