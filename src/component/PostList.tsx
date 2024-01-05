import React from 'react';
import { useSetRecoilState } from 'recoil';
import { Post, selectedPostState } from '../recoil';
import { Link, useNavigate } from 'react-router-dom';
import TimeAgoComponent from './TimeAgoComponent ';
import SanitizedHTML from '../hook/SanitizedHTML';

type PostListProps = {
  posts: Post[];
  title: string;
};

const PostList: React.FC<PostListProps> = ({ posts, title }) => {
  const navigate = useNavigate();
  const setSelectedPost = useSetRecoilState(selectedPostState);

  const handlePostClick = (selectedPost: Post) => {
    setSelectedPost(selectedPost);
    console.log(selectedPost)
    navigate(`/${selectedPost.author}/${selectedPost.postId}`);
  };
  console.log(posts)
  return (
    <div className='container'>
      <ul className='post-list'>
      <h2 className='post-list__title'>{title}</h2>
      <Link to="/write" className='write-link'>
        글쓰기
      </Link>
        {posts.map((post, index) => (
          <li key={index} className='post-list__item' onClick={() => handlePostClick(post)}>
            <div className='post-list__left'>
            <div className='post-list__header'>
              <span className='post-list__header__author'>{post.author}</span>
            </div>
            <div className='post-list__body'>
              <h3 className='post-list__body__heading'>{post.title}</h3>
              {/* <SanitizedHTML html={Object.values(post.content).join('')} /> */}
                </div>
                <div className='post-list__footer'>
                    <p className='post-list__footer__likes'>
                      <span> ♥️ </span>
                      {post.likes ? post.likes.length : 0}</p>
                    <p className='post-list__footer__comments'>
                    <span>댓글 </span>
                      {post.comments ? Object.keys(post.comments).length : 0}
                    </p>
                    <p className='post-list__footer__date'>
                      <TimeAgoComponent timestamp={post.createAt} />
                    </p>
                  </div>
                </div>
            <div className='post-list__right'>
              {post.imageUrls ? (
                      <div className='post-list__image'>
                        <img src={post.imageUrls[0]} alt="postImage" />
                      </div>
                    ):(
                    <>
                    </>
                    )}
            </div>


          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;