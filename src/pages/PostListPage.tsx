import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userState, Post, selectedPostState, selectedPostIdState, postsState, userPostsSelector } from '../recoil';
import { readPostData } from '../firebase/post';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from 'react-js-pagination';

const POSTS_PER_PAGE = 5; // 페이지당 포스트 수

const PostListPage: React.FC = () => {
    const navigate = useNavigate()
    const { uid } = useRecoilValue(userState);
    const [Posts, setPosts] = useRecoilState(postsState);
    const userPosts = useRecoilValue(userPostsSelector);

    const setSelectedPost = useSetRecoilState(selectedPostState);
    const setSelectedPostId = useSetRecoilState(selectedPostIdState);
    //pagenation
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    const postsArray = userPosts ?Object.values(userPosts) : []
    const currentPosts = postsArray.reverse().slice(indexOfFirstPost, indexOfLastPost);
    
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handlePostClick = (selectedPost: Post) => {
        setSelectedPost(selectedPost);
        setSelectedPostId(selectedPost.postId!)
        navigate(`/userpost/${selectedPost.postId}`)
    };
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
                    console.log('패치됨')
                    console.log(userPost)
                } catch (error) {
                    console.error('유저 포스트 불러오기에 실패', error);
                }
            }
        }
        fetchPost();
    }, [setPosts, uid]);

    if(!uid) return <>로그인해주세요</>
    if(!userPosts) return (
        <div>
            <span>작성한 글이 없습니다.</span>
            <Link to="/write"> 글쓰기</Link>
        </div>    
    )
    console.log(userPosts)
    return (
    <div>
        <h2>Your Posts</h2>
        <Link to="/write"> 글쓰기</Link>
        <ul>
            {currentPosts.map((post,index) => (
            <li key={index} onClick={()=>handlePostClick(post)}>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <p>작성자 {post.author}</p>
                    <p>좋아요 {post.likes}</p>
                    <p>작성일자 {post.createAt}</p>
                    <p>{post.comments ? Object.keys(post.comments).length: 0}개의 댓글</p>
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

export default PostListPage;