import { useState } from 'react';
import PostList from './PostList';
import { useRecoilState } from 'recoil';
import { lastPostKeyState, postsState } from '../recoil';
import { fetchMorePosts } from '../hook/fetchData';
import InfiniteScroll from './InfiniteScroll';
import LoadingSpinner from './LoadingSpinner';


const MainPost = () => {
  const [posts, setPosts] = useRecoilState(postsState);
  const [loading, setLoading] = useState(false);
  const [lastPostKey, setLastPostKey] = useRecoilState(lastPostKeyState);
  const [noMorePosts, setNoMorePosts] = useState(false);
  const reversedPosts = [...posts].reverse();

  const handleFetchMorePosts = async () => {
    setLoading(true);
    const hasMorePosts = await fetchMorePosts(setPosts, setLastPostKey, lastPostKey!);
    setLoading(false);

    if (!hasMorePosts) {
      setNoMorePosts(true);
    }
  };

  return (
    <div className='post-page'>
      <div className='layout'>
      <PostList posts={reversedPosts} label='mainpost' />
      <InfiniteScroll callback={handleFetchMorePosts} loading={loading}>
        <LoadingSpinner loading={loading} color={'#888'}/>
        {noMorePosts && <div className='no-posts'>게시물이 없습니다.</div>}
        <div style={{width:'100%', height:'100px',}}/>
      </InfiniteScroll>
      </div>
    </div>
  );
};

export default MainPost;