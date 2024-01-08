import React, { useEffect } from 'react';
import PostList from '../component/PostList';
import { useRecoilState, useRecoilValue } from 'recoil';
import { postsState, userState } from '../recoil';
import {fetchPostData} from '../hook/fetchData';
import useSortData from '../hook/useSotrData';

const PostPage = () => {
  const uid = useRecoilValue(userState).uid;
  const [posts, setPosts] = useRecoilState(postsState);
  const reversedPosts = [...posts].reverse();

  const { handleSortByLatest, handleSortByLikes, handleSortByComments } = useSortData(posts, setPosts);


  useEffect(() => {
    if(posts.length === 0 ){
      fetchPostData(setPosts);
    }
  }, [ uid,setPosts]);
  // console.log(posts)
  return (
    <div>
      <div>
      <button onClick={handleSortByLatest}>최신순</button>
        <button onClick={handleSortByLikes}>좋아요순</button>
        <button onClick={handleSortByComments}>댓글순</button>
      </div>
      <PostList posts={reversedPosts} title='Post'/>
    </div>
  );
};

export default PostPage;