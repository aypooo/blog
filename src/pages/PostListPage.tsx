import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userPostsSelector, singlePostState, selectedPostIdState, userState } from '../recoil';
import { readUserPost } from '../firebase/post';

const PostListPage: React.FC = () => {
    const { uid } = useRecoilValue(userState);
    const [userPosts, setUserPosts] = useRecoilState(userPostsSelector);
    const setSinglePost = useSetRecoilState(singlePostState);
    const setSelectedPostId = useSetRecoilState(selectedPostIdState);   
    console.log(uid)
    const handlePostClick = (postId: string) => {
        const selectedPost = userPosts.find((post) => post.postId === postId);
        setSinglePost(selectedPost || null);
        setSelectedPostId(postId);
    };
    //post fetch후에 recoil에 값넣고 뿌려야함
    useEffect(() => {
        async function fetchPost() {
            try {
                const userPost = await readUserPost(uid);
                setUserPosts(userPost || []); // Update Recoil state with fetched user posts
            } catch (error) {
                console.error('Error fetching user posts:', error);
                // 에러 처리 로직 추가
            }
        }
        fetchPost();
    }, [uid, setUserPosts]);
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