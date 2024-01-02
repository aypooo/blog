import React from 'react';
import { useSetRecoilState } from 'recoil';
import { Post, selectedPostState } from '../recoil';
import { Link, useNavigate } from 'react-router-dom';
import TimeAgoComponent from './TimeAgoComponent ';
type PostListProps = {
  posts: Post[];
  title: string;
};

const PostList: React.FC<PostListProps> = ({ posts, title }) => {
  const navigate = useNavigate();
  const setSelectedPost = useSetRecoilState(selectedPostState);

  const handlePostClick = (selectedPost: Post) => {
    setSelectedPost(selectedPost);
    navigate(`/${selectedPost.author}/${selectedPost.postId}`);
  };
  console.log(posts)
  return (
    <div className='post-list'>
      <h2 className='post-list__title'>{title}</h2>
      <Link to="/write" className='write-link'>
        글쓰기
      </Link>
      <ul>
        {posts.map((post, index) => (
          <li key={index} className='post-list__item' onClick={() => handlePostClick(post)}>
            <h3 className='post-list__item__heading'>{post.title}</h3>
            <p className='post-list__item__author'>작성자 {post.author}</p>
            <p className='post-list__item__likes'>좋아요 {post.likes}</p>
            <p className='post-list__item__date'>
              작성일자 <TimeAgoComponent timestamp={post.createAt} />
            </p>
            <p className='post-list__item__comments'>
              {post.comments ? Object.keys(post.comments).length : 0}개의 댓글
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;