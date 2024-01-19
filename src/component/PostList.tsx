import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { Post, selectedPostState } from '../recoil';
import { Link, useNavigate } from 'react-router-dom';
import TimeAgoComponent from './TimeAgoComponent ';
import SanitizedHTML from '../hook/SanitizedHTML';
import UserProfile from './UserProfile';
// import SanitizedHTML from '../hook/SanitizedHTML';


const PostList = ({ posts, title } : {posts: Post[],title?: string}) => {
  const navigate = useNavigate();
  const setSelectedPost = useSetRecoilState(selectedPostState);
  const handlePostClick = (selectedPost: Post) => {
    setSelectedPost(selectedPost);
    navigate(`/${selectedPost.author}/${selectedPost.postId}`);
  };
  const extractTextFromHTML = (htmlString: string) => {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || "";
  };
console.log('1',posts)
  return (
      <ul className='post-list'>
      {/* <h2 className='post-list__title'>{title}</h2> */}
        {posts.map((post, index) => (
          <li key={post.postId} className='post-list__item' >
            <div className='post-list__desc'>
              <div className='post-list__header'>
              <UserProfile>{post.author}</UserProfile>
              </div>
              <div className='post-list__body' onClick={() => handlePostClick(post)}>
                <div className='post-list__body__title'>{post.title}</div>
                <div className='post-list__body__content'>
                  {extractTextFromHTML(Object.values(post.content).join(''))}
                  {/* <SanitizedHTML html={Object.values(post.content).join('')} /> */}
                </div>
              </div>
              <div className='post-list__footer'>
                <div className='like-box boder-none'>
                    <span className='like--liked'></span>
                      {post.likes ? post.likes.length : 0}
                </div>
                  <div className='post-list__footer__comments'>
                  <span>댓글 </span>
                    {post.comments ? Object.keys(post.comments).length : 0}
                  </div>
                  <div className='post-list__footer__views'>
                    <span>조회수 {post.views}</span>
                  </div>
                  <div className='post-list__footer__date'>
                    <TimeAgoComponent timestamp={post.createAt} />
                  </div>
              </div>
            </div>
              {post.imageUrls ? (
                <div className='post-list__image' onClick={() => handlePostClick(post)}>
                    <img src={post.imageUrls[0]} alt="postImage" />
                  </div>
                ):(
                <>
                </>
                )}
          </li>
        ))}

      </ul>
  );
};

export default PostList;