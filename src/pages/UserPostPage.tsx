import React, { useEffect, useState } from 'react';
import PostList from '../component/PostList';
import { Link, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { postsState, selectedUserState, userPostsSelector, userState } from '../recoil';
import Pagination from '../component/Pagination';
import {fetchPostData} from '../hook/fetchData';


const POSTS_PER_PAGE = 10; // 페이지당 포스트 수

const UserPostPage = () => {
    const { user } = useParams()
    const { uid } = useRecoilValue(userState);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useRecoilState(selectedUserState);
    const [posts, setPosts] = useRecoilState(postsState);
    const userPosts = useRecoilValue(selectedUser ? userPostsSelector : postsState);
    // Pagination logic
    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    const postsArray = userPosts ? Object.values(userPosts) : [];
    const currentPosts = postsArray.reverse().slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    useEffect(() => {
        setSelectedUser(user!)
        setCurrentPage(1);
    }, [selectedUser, setSelectedUser, user]);

    useEffect(() => {
        //우선 적용, 여기서도 불러와야할지 아니면 다르게 처리 할지 고민요망
        if(posts.length === 0 ){
            console.log('userPostFetch')
            fetchPostData(setPosts);
        }
      }, [uid, setPosts]);
    
    if(!uid) return <>로그인해주세요</>
    return (
        <div className="user-post-page">
          {(!userPosts || Object.keys(userPosts).length === 0) ? (
            <div className="user-post-page__no-posts">
              <span>작성한 글이 없습니다.</span>
              <Link to="/write" className="write-link"> 글쓰기</Link>
            </div>
          ) : (
            <div>
              <PostList posts={currentPosts} title='Your Post' />
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={POSTS_PER_PAGE}
                totalItemsCount={Object.keys(userPosts).length}
                onChange={paginate}
              />
            </div>
          )}
        </div>
      );
    };
    

export default UserPostPage;