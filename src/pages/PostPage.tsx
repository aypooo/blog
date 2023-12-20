import React, { useEffect } from 'react';
import PostList from '../component/PostList';
import { readPostData } from '../firebase/post';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { postsState, userState } from '../recoil';

const PostPage = () => {
    const { uid } = useRecoilValue(userState);
    const setPosts = useSetRecoilState(postsState);
    useEffect(() => {
        async function fetchPost() {
            if(uid){
                try {
                    const userPost= await readPostData(uid);
                    const postArray = Object.entries(userPost).map(([postId, post]) => ({
                        postId,
                        author:post.author,
                        content:post.content,
                        comments: post.comments, 
                        createAt: post.createAt,
                        likes: post.likes, 
                        title:post.title,
                        uid: post.uid,
                      }));
                      setPosts(postArray);    
                } catch (error) {
                    console.error('유저 포스트 불러오기에 실패', error);
                }
            }
        }
        fetchPost();
    }, [setPosts, uid]);

    return (
        <div>
            <PostList/>
        </div>
    );
};

export default PostPage;