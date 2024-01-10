import React, { useEffect, useState } from 'react';
import PostList from '../component/PostList';
import { useRecoilState, useRecoilValue } from 'recoil';
import { lastPostKeyState, postsState, userState } from '../recoil';
import { fetchMorePosts, fetchPostData } from '../hook/fetchData';
import useSortData from '../hook/useSotrData';
import InfiniteScroll from '../component/InfiniteScroll';


const PostPage = () => {
  const uid = useRecoilValue(userState).uid;
  const [posts, setPosts] = useRecoilState(postsState);
  const reversedPosts = [...posts].reverse();
  const [lastPostKey, setLastPostKey] = useRecoilState(lastPostKeyState);

  const { handleSortByLatest, handleSortByLikes, handleSortByComments } = useSortData(posts, setPosts);

  // console.log(lastPostKey)

  const handleFetchMorePosts = async () => {
    await fetchMorePosts(setPosts, setLastPostKey, lastPostKey!);
  };


  useEffect(() => {
    if (posts.length === 0) {
      // fetchPostData(setPosts);
    }
  }, [uid, setPosts]);
console.log(posts)
  return (
    <div>
      <div>
        <button onClick={handleSortByLatest}>최신순</button>
        <button onClick={handleSortByLikes}>좋아요순</button>
        <button onClick={handleSortByComments}>댓글순</button>
      </div>
      <PostList posts={reversedPosts} title='Post' />
      <InfiniteScroll loadMore={handleFetchMorePosts}>
        <button onClick={handleFetchMorePosts}>loadMore</button>
              <div style={{width:'100%', height:'100px', background:'red'}}>로드위치</div>
      </InfiniteScroll>
    </div>
  );
};

export default PostPage;