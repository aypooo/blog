import { useState } from 'react';
import PostList from '../component/PostList';
import { useRecoilState } from 'recoil';
import { lastPostKeyState, postsState } from '../recoil';
import { fetchMorePosts } from '../hook/fetchData';
import InfiniteScroll from '../component/InfiniteScroll';
import LoadingSpinner from '../component/LoadingSpinner';


const PostPage = () => {
  // const { uid } = useRecoilValue(userState)
  const [posts, setPosts] = useRecoilState(postsState);
  const [loading, setLoading] = useState(false);
  const [lastPostKey, setLastPostKey] = useRecoilState(lastPostKeyState);
  const [noMorePosts, setNoMorePosts] = useState(false);
  const reversedPosts = [...posts].reverse();

  // const { handleSortByLatest, handleSortByLikes, handleSortByComments } = useSortData(posts, setPosts);
  const handleFetchMorePosts = async () => {
    setLoading(true);
    const hasMorePosts = await fetchMorePosts(setPosts, setLastPostKey, lastPostKey!);
    setLoading(false);

    if (!hasMorePosts) {
      setNoMorePosts(true);
    }
  };
// console.log(posts)
  return (
    <div>
      {/* <div>
        <button onClick={handleSortByLatest}>최신순</button>
        <button onClick={handleSortByLikes}>좋아요순</button>
        <button onClick={handleSortByComments}>댓글순</button>
      </div> */}
      <PostList posts={reversedPosts} title='Post' />
      <InfiniteScroll callback={handleFetchMorePosts} loading={loading}>
      <LoadingSpinner loading={loading} color={'#888'}/>
        {noMorePosts && <div>게시물이 없습니다.</div>}
          <div style={{width:'100%', height:'100px',}}/>
      </InfiniteScroll>
    </div>
  );
};

export default PostPage;