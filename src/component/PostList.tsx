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

  return (
    <div className='container'>
      <ul className='post-list'>
      <h2 className='post-list__title'>{title}</h2>
      <Link to="/write" className='write-link'>
        글쓰기
      </Link>
        {posts.map((post, index) => (
          <li key={index} className='post-list__item' onClick={() => handlePostClick(post)}>
            <div className='post-list__header'>
              <p className='post-list__header__author'>{post.author}</p>
            </div>
            <div className='post-list__body'>
              <h3 className='post-list__content__heading'>{post.title}</h3>
              <h3 className='post-list__content__content'>{post.content}</h3>
            </div>
            <div className='post-list__footer'>
              <p className='post-list__footer__date'>
                <TimeAgoComponent timestamp={post.createAt}/>
              </p>
              <p className='post-list__footer__likes'>
                <span>좋아요</span>
                {post.likes}</p>
              <p className='post-list__footer__comments'>
                {post.comments ? Object.keys(post.comments).length : 0}
                <span>개의 댓글</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;