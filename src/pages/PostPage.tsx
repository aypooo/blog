import React, { useEffect } from 'react';
import PostList from '../component/PostList';
import { useRecoilState, useRecoilValue } from 'recoil';
import { postsState, userState } from '../recoil';
import FetchPostData from '../hook/fetchPostData';

const PostPage = () => {
  const uid = useRecoilValue(userState).uid;
  const [posts, setPosts] = useRecoilState(postsState);

  useEffect(() => {
    FetchPostData(uid, setPosts);
  }, [uid, setPosts]);

  return (
    <div>
      <PostList posts={posts} title='Post'/>
    </div>
  );
};

export default PostPage;