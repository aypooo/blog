import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userState, Post, userPostsState, selectedPostState, selectedPostIdState } from '../recoil';
import { readUserPost } from '../firebase/post';
import { useNavigate } from 'react-router-dom';

const PostListPage: React.FC = () => {
    const navigate = useNavigate()
    const { uid } = useRecoilValue(userState);
    const [userPosts, setUserPosts] = useRecoilState<Post[]>(userPostsState);
    const setSelectedPost = useSetRecoilState(selectedPostState);
    const setSelectedPostId = useSetRecoilState(selectedPostIdState);   
    console.log(Object.entries(userPosts))
    const handlePostClick = (selectedPost: Post, postId:string) => {
        setSelectedPost(selectedPost);
        setSelectedPostId(postId)
        navigate(`/post/${postId}`)
    };
    useEffect(() => {
        async function fetchPost() {
            if(uid){
                try {
                    const userPost = await readUserPost(uid);
                    setUserPosts(userPost);
                    console.log(userPost)
                } catch (error) {
                    console.error('Error fetching user posts:', error);
                }
            }
        }
        fetchPost();
    }, [setUserPosts, uid]);
    if(!uid) return <>로그인해주세요</>
    if(userPosts.length === 0) return <>작성한 글이 없습니다.</>
    return (
    <div>
        <h2>Your Posts</h2>
        <ul>
        {Object.entries(userPosts).reverse().map((post,index) => (
        <li key={index} onClick={()=>handlePostClick(post[1],post[0])}>
                <h3>{Object.values(post[1].title)}</h3>
                <p>{Object.values(post[1].content)}</p>
                <p>작성자 {Object.values(post[1].author)}</p>
                <p>좋아요 {Object.values(post[1].likes)}</p>
                <p>작성일자 {Object.values(post[1].createAt)}</p>
                
        </li>
        ))}
        </ul>
    </div>
    );
};

export default PostListPage;