import React, { useEffect, useState } from 'react';
import PostList from './PostList';
import { useParams } from 'react-router-dom';
import Pagination from './Pagination';
import { Post } from '../recoil';
import LoadingSpinner from './LoadingSpinner';


interface UserPostProps {
  userPosts: Post[];
  label:string;
}

const POSTS_PER_PAGE = 10; // 페이지당 포스트 수

const UserPost: React.FC<UserPostProps> = ({ userPosts, label }) => {
    const { author } = useParams()
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true)

    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    const postsArray = userPosts ? Object.values(userPosts) : [];
    const currentPosts = postsArray.reverse().slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    useEffect(() => {
      
      setTimeout(() => {
        if (userPosts.length === 0) {
          setLoading(false);
        }
        
      }, 1000); 
      setLoading(false); 
      setCurrentPage(1);
    }, [author, userPosts]);
    // console.log('userPost:',userPosts)
    return (
      <div className="user-post-page">
        {loading ? (
          <LoadingSpinner loading={loading} />
        ) : (
          <>
            {(currentPosts.length === 0) ? (
              <>
              {label === 'bookmark' ?(
                <div>
                  <span>담은 글이 없습니다.</span>
                </div>
                ):(
                  <div>
                  <span>작성한 글이 없습니다.</span>
                </div>
                )}
              </>
            ) : (
              <div>
                <PostList posts={currentPosts} label={label} />
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={POSTS_PER_PAGE}
                  totalItemsCount={Object.keys(userPosts).length}
                  onChange={paginate}
                />
              </div>
            )}
          </>
        )}
      </div>
    );
    };
    

export default UserPost;