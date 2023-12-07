import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userPostsSelector, singlePostState, selectedPostIdState, userState, Post } from '../recoil';
import { readUserPost } from '../firebase/post';

const PostListPage: React.FC = () => {
    const { uid } = useRecoilValue(userState);
    const [userPosts, SetUserPosts] = useState<Post[]>([])
    // const [userPosts, setUserPosts] = useRecoilState(userPostsSelector);
    // const setSinglePost = useSetRecoilState(singlePostState);
    // const setSelectedPostId = useSetRecoilState(selectedPostIdState);   
    // console.log(uid)
    // const handlePostClick = (postId: string) => {
    //     const selectedPost = userPosts.find((post) => post.postId === postId);
    //     setSinglePost(selectedPost || null);
    //     setSelectedPostId(postId);
    // };
    //post fetch후에 recoil에 값넣고 뿌려야함
    useEffect(() => {
     
        async function fetchPost() {
            if(uid){
                try {
                    const userPost = await readUserPost(uid);
                    SetUserPosts(userPost)
                    // setUserPosts(userPost);
                } catch (error) {
                    console.error('Error fetching user posts:', error);
                }
            }
        }
        fetchPost();
    }, [uid]);
    console.log(userPosts)
    if(!uid) return <>로그인해주세요</>
    if(userPosts.length === 0) return <>작성한 글이 없습니다.</>
    console.log(uid)
    return (
    <div>
        <h2>Your Posts</h2>
        <ul>
        {Object.values(userPosts).reverse().map((post, index) => (
        <li key={index}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p>작성자 {post.author}</p>
                <p>좋아요 {post.likes}</p>
                <p>작성일자 {post.createAt}</p>
                
        </li>
        ))}
        </ul>
    </div>
    );
};

export default PostListPage;