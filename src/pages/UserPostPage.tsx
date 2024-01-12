import React, { useEffect, useState } from 'react';
import PostList from '../component/PostList';
import { Link, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { selectedUserState, userPostsState, userState } from '../recoil';
import Pagination from '../component/Pagination';
import {fetchAuthorPostData} from '../hook/fetchData';


const POSTS_PER_PAGE = 10; // 페이지당 포스트 수

const UserPostPage = () => {
    const { user } = useParams()
    const { uid } = useRecoilValue(userState);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useRecoilState(selectedUserState);
    const [userPosts, setUserPosts] = useRecoilState(userPostsState);

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
      fetchAuthorPostData(setUserPosts,user!)

      }, [user, setUserPosts]);
    
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
              <PostList posts={currentPosts} title={`${user} post`} />
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