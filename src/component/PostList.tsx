import { useSetRecoilState } from 'recoil';
import { Post, selectedPostState } from '../recoil';
import {  useNavigate } from 'react-router-dom';
import TimeAgoComponent from './TimeAgoComponent ';
import UserProfile from './UserProfile';

const PostList = ({ posts,label } : {posts: Post[],label:string}) => {
  const navigate = useNavigate();
  const setSelectedPost = useSetRecoilState(selectedPostState);
  const handlePostClick = (post: Post) => {
    console.log(post)
    setSelectedPost(post);
    navigate(`/${post.author}/${post.postId}`);
  };
  const extractTextFromHTML = (htmlString: string) => {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || "";
  };
// console.log('postList',posts)
  return (
      <ul className='post-list'>
        {posts.map((post, index) => (
          <li key={`${post.postId}-${label}-${index}`} className='post-list__item' >
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
              {post.imageUrls && post.imageUrls.length > 0 ? (
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