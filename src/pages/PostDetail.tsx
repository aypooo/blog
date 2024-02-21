import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Post, postsState, selectedPostState, userPostsState, userState } from '../recoil';
import { deletePost, updateViews } from '../firebase/post';
import { useNavigate, useParams } from 'react-router-dom';
import Comments from '../component/Comments';
import UserProfile from '../component/UserProfile';
import SanitizedHTML from '../hook/SanitizedHTML';
import { useToggleLike } from '../hook/useToggleLike';
import { LikeUpdate } from '../firebase/like';
import Button from '../component/Button';
import { useModal } from '../hook/useModal';
import { bookMarkPost, removeBookmark } from '../firebase/bookmark';
import { fetchPostDataById } from '../hook/fetchData';
import LoadingSpinner from '../component/LoadingSpinner';

const PostDetail: React.FC = () => {
  const { postid } = useParams();
  const navigate = useNavigate()
  const [user,setUser] = useRecoilState(userState);
  const [selectedpost,setSelectedPost] = useRecoilState<Post | null>(selectedPostState);
  const [postdata,setPostdata] = useState<Post>()
  const setPosts = useSetRecoilState(postsState)
  const setUserPosts = useSetRecoilState(userPostsState);
  const toggleLike = useToggleLike(selectedpost ? selectedpost.postId : "" , user.uid);
  const [isBookmarked,setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false);
  const { openModal,closeModal } = useModal();
  
  useEffect(() => {
    setLoading(true)
    if(selectedpost){
      setPostdata(selectedpost)
    }else{
      fetchPostDataById(setPostdata,postid!)
    }
    setLoading(false) 
  }, [postid, selectedpost]);

  useEffect(() => {
    window.scroll(0,0)
    const handleUpdateViews = async ()=>{
      try{
        if(postdata){
          await updateViews(postdata!.postId)
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
            post.postId === postdata!.postId ? { ...post, views: post.views + 1 } : post
          ))
          setUserPosts((prevPosts) =>
            prevPosts.map((post) =>
            post.postId === post!.postId ? { ...post, views: post.views + 1 } : post
          ))
          setSelectedPost((prevpost) => ({
            ...(prevpost as Post),
            views: (prevpost?.views || 0) + 1,
          }));
        }
    }catch(error){
      console.log(error)
    }
    }
      const timeoutId = setTimeout(() => {
        handleUpdateViews()
      }, 1);
    
      return () => clearTimeout(timeoutId);

  }, [setSelectedPost]);
  useEffect(() => {
    if(user.bookmark && selectedpost){
      setIsBookmarked(user.bookmark?.includes(selectedpost!.postId));
    }
      
  }, [selectedpost, setIsBookmarked, user.bookmark]);
  
  const handleUpdatePost = () => {
    navigate(`/write/${postdata!.postId}`)
  }
  const handleConfirmDelete = async () => {
    try {
      await deletePost(postdata!.postId);
      setPosts((prevUserPosts) => prevUserPosts.filter((post) => post.postId !== postdata!.postId));
      setUserPosts((prevUserPosts) => prevUserPosts.filter((post) => post.postId !== postdata!.postId));
      setSelectedPost(null);
      closeModal()
      navigate(`/${postdata!.author}`);
    } catch (error) {
      console.error('포스트 삭제 중 오류 발생:', error);
    }
  };
  const handleLike = async () => {
    try {
      await LikeUpdate(postdata!.postId, user.uid);
      // 성공적으로 서버에서 좋아요 토글이 완료된 경우 Recoil 상태 업데이트
      toggleLike()
      setSelectedPost((prevpost) => {
        if (prevpost) {
          const currentLikes = prevpost.likes || [];
          
          // 이미 해당 사용자의 uid가 likes 배열에 존재한다면 제거
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
  const handleBookmarkToggle = async () => {
    try {
      if (user.bookmark?.includes(postdata!.postId)) {
        await removeBookmark(user.uid, postdata!.postId);
        // setIsBookmarked(false)
        console.log('글담기 삭제',isBookmarked)
      } else {
        await bookMarkPost(user.uid, postdata!.postId);
        // setIsBookmarked(true)
        console.log('글담기',isBookmarked)
        
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

  const modalData = {
    content: '글을 삭제 하시겠습니까?',
    callback: () => {
      handleConfirmDelete()
    }
  };
  return (
    <div className='postDetail'>
      {loading ? (
        <LoadingSpinner loading={loading} />
      ) : (
        <div className='layout'>
          {postdata ? (
            <div className='postDetail__content'>
              <div className='postDetail__title'>
                {postdata?.title}
              </div>
              <div className='postDetail__info'>
                <div className='postDetail__info__author'>
                  <UserProfile>{postdata?.author}</UserProfile>
                  <div className='postDetail__info__views'> 
                    조회수 {postdata?.views}
                  </div>
                </div>
                {user.uid === postdata?.postUid ? (
                  <div className='postDetail__info__edit'>
                    <Button size='s' label='수정' onClick={handleUpdatePost} />
                    <Button size='s' label='삭제' onClick={() => openModal(modalData)} />
                  </div>
                ) : (
                  <div onClick={handleBookmarkToggle} className='bookmark-box m'>
                    <Button
                      label={isBookmarked ? '글담기 취소' : '글담기'}
                      size='s'
                      className={`bookmark${user.bookmark?.includes(postdata!.postId) ? '--bookmarked' : ''}`}
                    />
                  </div>
                )}
              </div>
              <div className='postDetail__body'>
                <SanitizedHTML html={Object.values(postdata!.content).join('')} />
              </div>
              <div className='postDetail__footer' key={postdata!.postId}>
                <div onClick={handleLike} className='like-box m'> 
                  <button className={`like${postdata?.likes?.includes(user.uid) ? '--liked m' : ' m'}`} />
                  {postdata ? (postdata.likes ? postdata.likes.length : 0) : 0}
                </div>
              </div>
              <Comments commentProps={postdata!.comments} postId={postdata!.postId} postUid={postdata!.postUid} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );  
}
export default PostDetail;