import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Post, postsState, selectedPostState, userPostsState, userState } from '../recoil';
import { deletePost } from '../firebase/post';
import { useNavigate, useParams } from 'react-router-dom';
import Comments from '../component/Comments';
import UserProfile from '../component/UserProfile';
import SanitizedHTML from '../hook/SanitizedHTML';
import { useToggleLike } from '../hook/useToggleLike';
import { LikeUpdate } from '../firebase/like';
import Button from '../component/Button';
import { useModal } from '../hook/useModal';
import { bookMarkPost, removeBookmark } from '../firebase/bookmark';
import { fetchPostDataByNumber } from '../hook/fetchData';
import LoadingSpinner from '../component/LoadingSpinner';

const PostDetail: React.FC = () => {
  const { postnumber } = useParams(); 
  const navigate = useNavigate(); 
  const [user, setUser] = useRecoilState(userState); 
  const [selectedpost, setSelectedPost] = useRecoilState(selectedPostState); 
  const setPosts = useSetRecoilState(postsState); 
  const setUserPosts = useSetRecoilState(userPostsState); 
  const [postdata, setPostdata] = useState<Post>(); 
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false); 
  const toggleLike = useToggleLike(selectedpost ? selectedpost.postId : "", user.uid); // 좋아요 토글 훅 사용
  const { openModal, closeModal } = useModal(); // 모달 관리 훅 사용

  // 포스트 데이터 로딩 및 상태 업데이트
  useEffect(() => {
    setLoading(true);
    if (selectedpost) {
      setPostdata(selectedpost);
    } else {
      fetchPostDataByNumber(setSelectedPost, postnumber!);
      setPostdata(selectedpost!);
    }
    setLoading(false);
  }, [postdata, postnumber, selectedpost, setSelectedPost]);

  // 북마크 상태 업데이트
  useEffect(() => {
    if (user.bookmark && selectedpost) {
      setIsBookmarked(user.bookmark?.includes(selectedpost!.postId));
    }
  }, [selectedpost, setIsBookmarked, user.bookmark]);

  // 포스트 수정 페이지로 이동
  const handleUpdatePost = () => {
    navigate(`/write/${postdata?.postNumber}`);
  };

  // 포스트 삭제 확인
  const handleConfirmDelete = async () => {
    try {
      await deletePost(postdata!.postId);
      setPosts((prevUserPosts) => prevUserPosts.filter((post) => post.postId !== postdata!.postId));
      setUserPosts((prevUserPosts) => prevUserPosts.filter((post) => post.postId !== postdata!.postId));
      setSelectedPost(null);
      closeModal();
      navigate(`/${postdata!.author}`);
    } catch (error) {
      console.error('포스트 삭제 중 오류 발생:', error);
    }
  };

  // 좋아요 토글
  const handleLike = async () => {
    try {
      await LikeUpdate(postdata!.postId, user.uid);
      toggleLike();
      setSelectedPost((prevpost) => {
        if (prevpost) {
          const currentLikes = prevpost.likes || [];
          const updatedLikes = currentLikes.includes(user.uid)
            ? currentLikes.filter((likeUid) => likeUid !== user.uid)
            : [...currentLikes, user.uid];
          return {
            ...(prevpost as Post),
            likes: updatedLikes,
          };
        }
        return prevpost;
      });
    } catch (error) {
      console.error('좋아요 토글 중 오류 발생:', error);
    }
  };

  // 북마크 토글
  const handleBookmarkToggle = async () => {
    try {
      if (!user.uid) {
        return openModal({
          content: '글담기는 로그인 후 가능합니다.',
          hasCancelButton:false,
          callback: () => {
            closeModal()
            navigate(`/login`);
          },
        });
      }
      if (user.bookmark?.includes(postdata!.postId)) {
        await removeBookmark(user.uid, postdata!.postId);
      } else {
        await bookMarkPost(user.uid, postdata!.postId);
      }
      setUser((prevUser) => ({
        ...prevUser,
        bookmark: prevUser.bookmark?.includes(postdata!.postId)
          ? prevUser.bookmark?.filter((postId) => postId !== postdata!.postId)
          : [...(prevUser.bookmark || []), postdata!.postId],
      }));
    } catch (error) {
      console.error('Bookmark toggle error:', error);
    }
  };

  // 삭제 모달 데이터
  const modalData = {
    content: '글을 삭제 하시겠습니까?',
    hasCancelButton:true,
    color:'red',
    callback: () => {
      handleConfirmDelete();
    },
  };

  return (
    <div className='postDetail'>
      {loading ? ( // 데이터 로딩 중일 때 로딩 스피너 표시
        <LoadingSpinner data-testid='loading-spinner' loading={loading} />
      ) : (
        <div className='layout'>
          {postdata && ( // 포스트 데이터가 있을 때
            <div className='postDetail__content'>
              <div className='postDetail__title'>{postdata?.title}</div> {/* 포스트 제목 표시 */}
              <div className='postDetail__info'>
                <div className='postDetail__info__author'>
                  <UserProfile>{postdata?.author}</UserProfile> {/* 포스트 작성자 프로필 표시 */}
                  <div className='postDetail__info__views'>조회수 {postdata?.views}</div> {/* 조회수 표시 */}
                </div>
                {user.uid === postdata?.postUid ? ( // 현재 사용자가 포스트 작성자일 때
                  <div className='postDetail__info__edit'>
                    <Button size='s' label='수정' onClick={handleUpdatePost} /> {/* 수정 버튼 */}
                    <Button size='s' label='삭제' onClick={() => openModal(modalData)} /> {/* 삭제 버튼 */}
                  </div>
                ) : (
                  <div onClick={handleBookmarkToggle} className='bookmark-box m'>
                    <Button
                      label={isBookmarked ? '글담기 취소' : '글담기'}
                      size='s'
                      className={`bookmark${user.bookmark?.includes(postdata?.postId) ? '--bookmarked' : ''}`}
                    /> {/* 북마크 버튼 */}
                  </div>
                )}
              </div>
              <div className='postDetail__body'>
                <SanitizedHTML html={postdata && postdata.content ? Object.values(postdata.content).join('') : ''} /> {/* 포스트 내용 */}
              </div>
              <div className='postDetail__footer' key={postdata?.postId}>
                <div onClick={handleLike} className='like-box m'>
                  <button className={`like${postdata?.likes?.includes(user.uid) ? '--liked m' : ' m'}`} />
                  {postdata ? (postdata.likes ? postdata.likes.length : 0) : 0} {/* 좋아요 수 표시 */}
                </div>
              </div>
              <Comments postId={postdata?.postId} postUid={postdata?.postUid} /> {/* 댓글 컴포넌트 */}
            </div>
          )}
        </div>
      )}
    </div>
  );
  
};

export default PostDetail;
