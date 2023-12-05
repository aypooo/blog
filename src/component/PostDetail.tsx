import React from 'react';
import { useRecoilValue } from 'recoil';
import { singlePostState } from '../recoil';

const PostDetail: React.FC = () => {
  const singlePost = useRecoilValue(singlePostState);

  if (!singlePost) {
    return null;
  }

  return (
    <div>
      <h2>Post Detail</h2>
      <h3>{singlePost.title}</h3>
      <p>{singlePost.content}</p>
    </div>
  );
};

export default PostDetail;