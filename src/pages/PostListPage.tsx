import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userState, Post, userPostsState, selectedPostState, selectedPostIdState, commentsCountState } from '../recoil';
import { readUserPost } from '../firebase/post';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from 'react-js-pagination';

const POSTS_PER_PAGE = 5; // 페이지당 포스트 수

const PostListPage: React.FC = () => {
    const navigate = useNavigate()
    const { uid, } = useRecoilValue(userState);
    const [userPosts, setUserPosts] = useRecoilState(userPostsState);
    const setSelectedPost = useSetRecoilState(selectedPostState);
    const setSelectedPostId = useSetRecoilState(selectedPostIdState); 
    const [commentCount, setCommentCount] = useRecoilState(commentsCountState)  
    //pagenation
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    const postsArray = userPosts ? Object.entries(userPosts) : []
    const currentPosts = postsArray.reverse().slice(indexOfFirstPost, indexOfLastPost);

    
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handlePostClick = (selectedPost: Post, postId:string) => {
        setSelectedPost(selectedPost);
        setSelectedPostId(postId)
        navigate(`/userpost/${postId}`)
    };
    useEffect(() => {
        async function fetchPost() {
            if(uid){
                try {
                    const userPost = await readUserPost(uid);
                    setUserPosts(userPost);
            
                    if(userPost.comments){
                      
                      setCommentCount(Object.keys(userPost.comments).length)
                    }         
                } catch (error) {
                    console.error('유저 포스트 불러오기에 실패', error);
                }
            }
        }
        fetchPost();
    }, [setCommentCount, setUserPosts, uid]);

    if(!uid) return <>로그인해주세요</>
    if(!userPosts) return <>작성한 글이 없습니다.
         <Link to="/write"> 글쓰기</Link>
    </>



  console.log(userPosts)
    return (
    <div>
        <h2>Your Posts</h2>
        <Link to="/write"> 글쓰기</Link>
        <ul>
            {currentPosts.map((post,index) => (
            <li key={index} onClick={()=>handlePostClick(post[1],post[0])}>
                    <h3>{Object.values(post[1].title)}</h3>
                    <p>{Object.values(post[1].content)}</p>
                    <p>작성자 {Object.values(post[1].author)}</p>
                    <p>좋아요 {Object.values(post[1].likes)}</p>
                    <p>작성일자 {Object.values(post[1].createAt)}</p>
                    <p>{post[1].comments ? Object.keys(post[1].comments).length : 0}개의 댓글</p>
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