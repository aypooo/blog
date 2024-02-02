import React, { useEffect, useState } from 'react';
import PostList from './PostList';
import { useParams } from 'react-router-dom';
import Pagination from './Pagination';
import { Post } from '../recoil';


interface UserPostProps {
  userPosts: Post[];
}

const POSTS_PER_PAGE = 10; // 페이지당 포스트 수

const UserPost: React.FC<UserPostProps> = ({ userPosts }) => {
    const { author } = useParams()
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    const postsArray = userPosts ? Object.values(userPosts) : [];
    const currentPosts = postsArray.reverse().slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    useEffect(() => {
        setCurrentPage(1);
    }, [ author]);


    // if(!uid) return <>로그인해주세요</>
    return (
        <div className="user-post-page">
          {(!userPosts || Object.keys(userPosts).length === 0) ? (
            <div className="user-post-page__no-posts">
              <span>작성한 글이 없습니다.</span>

            </div>
          ) : (
            <div>
              <PostList posts={currentPosts} title={`${author} post`} />
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
    

export default UserPost;