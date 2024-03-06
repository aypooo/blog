import { useSetRecoilState } from 'recoil';
import { Post, selectedPostState } from '../recoil';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import TimeAgoComponent from './TimeAgoComponent ';

const PostList = ({ posts, label }: { posts: Post[], label: string }) => {
  const navigate = useNavigate();
  const setSelectedPost = useSetRecoilState(selectedPostState);

  // innerHTML 문자열에서 텍스트 추출하는 함수
  const extractTextFromHTML = (htmlString: string) => {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || "";
  };

  // 포스트 클릭 핸들러
  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    navigate(`/${post.author}/${post.postNumber}`);
  };

  return (
    <ul className='post-list'  data-testid={label}>
      {posts.map((post, index) => (
        <li key={`${post.postId}-${label}-${index}`} className='post-list__item' data-testid={`post-item-${index}`}>
          <div className='post-list__desc'>
            {/* 포스트 헤더 */}
            <div className='post-list__header'>
              <UserProfile>{post.author}</UserProfile>
            </div>

            {/* 포스트 바디 */}
            <div className='post-list__body' onClick={() => handlePostClick(post)}>
              <div className='post-list__body__title'>{post.title}</div>
              <div className='post-list__body__content'>
                {extractTextFromHTML(Object.values(post.content).join(''))}
              </div>
            </div>

            {/* 포스트 푸터 */}
            <div className='post-list__footer'>
              <div className='like-box boder-none'>
                <span className='like--liked'></span>
                {post.likes ? post.likes.length : 0}
              </div>
              <div className='post-list__footer__comments' data-testid={`post-comments-${index}`}>
                <span>댓글 </span>
                {post.comments ? Object.keys(post.comments).length : 0}
              </div>
              <div className='post-list__footer__views' data-testid={`post-views-${index}`}>
                <span>조회수 {post.views}</span>
              </div>
              <div className='post-list__footer__date' data-testid={`post-date-${index}`}>
                <TimeAgoComponent timestamp={post.createAt} />
              </div>
            </div>
          </div>

          {/* 포스트 이미지 */}
          {post.imageUrls && post.imageUrls.length > 0 && (
            <div className='post-list__image' onClick={() => handlePostClick(post)} data-testid={`post-image-${index}`}>
              <img src={post.imageUrls[0]} alt={`postImage-${index}`} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default PostList;