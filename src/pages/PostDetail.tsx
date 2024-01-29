import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Post, modalContentState, postsState, selectedPostState, userPostsState, userState } from '../recoil';
import { deletePost, updateViews } from '../firebase/post';
import { useNavigate } from 'react-router-dom';
import Comments from '../component/Comments';
import UserProfile from '../component/UserProfile';
import SanitizedHTML from '../hook/SanitizedHTML';
import { useToggleLike } from '../hook/useToggleLike';
import { LikeUpdate } from '../firebase/like';
import Button from '../component/Button';
import Modal from '../component/Modal';
import { useModal } from '../hook/useModal';

const PostDetail: React.FC = () => {
  const navigate = useNavigate()
  const { uid } = useRecoilValue(userState);
  const [selectedpost,setSelectedPost] = useRecoilState<Post | null>(selectedPostState);
  const setPosts = useSetRecoilState(postsState)
  const setUserPosts = useSetRecoilState(userPostsState);
  const toggleLike = useToggleLike(selectedpost ? selectedpost.postId : "" , uid);
  const { openModal,closeModal } = useModal();

  useEffect(() => {
    window.scroll(0,0)
    if (!selectedpost) {
      navigate('/')
    }
    const handleUpdateViews = async ()=>{
      await updateViews(selectedpost!.postId)
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
        post.postId === selectedpost!.postId ? { ...post, views: post.views + 1 } : post
      ))
      setUserPosts((prevPosts) =>
        prevPosts.map((post) =>
        post.postId === selectedpost!.postId ? { ...post, views: post.views + 1 } : post
      ))
      setSelectedPost((prevpost) => ({
        ...(prevpost as Post),
        views: (prevpost?.views || 0) + 1,
      }));
    }
      const timeoutId = setTimeout(() => {
        handleUpdateViews()
      }, 1);
    
      return () => clearTimeout(timeoutId);
  }, [setSelectedPost]);

  if (!selectedpost) {
    navigate('/')
    return null;
  } 
  
  const handleUpdatePost = () => {
    navigate(`/write/${selectedpost.postId}`)
  }
  // const handleDeletePost = async () => {
  //   setConfirmModalOpen(true);
  // };
  const handleConfirmDelete = async () => {
    try {
      await deletePost(selectedpost.postId, selectedpost.postUid);
      setPosts((prevUserPosts) => prevUserPosts.filter((post) => post.postId !== selectedpost.postId));
      setUserPosts((prevUserPosts) => prevUserPosts.filter((post) => post.postId !== selectedpost.postId));
      setSelectedPost(null);
      closeModal()
      navigate(`/${selectedpost.author}`);
    } catch (error) {
      console.error('포스트 삭제 중 오류 발생:', error);
    }
  };
  const handleLike = async () => {
    try {
      await LikeUpdate(selectedpost.postId, uid);
      // 성공적으로 서버에서 좋아요 토글이 완료된 경우 Recoil 상태 업데이트
      toggleLike()
      setSelectedPost((prevpost) => {
        if (prevpost) {
          const currentLikes = prevpost.likes || [];
          
          // 이미 해당 사용자의 uid가 likes 배열에 존재한다면 제거
          const updatedLikes = currentLikes.includes(uid)
            ? currentLikes.filter((likeUid) => likeUid !== uid)
            : [...currentLikes, uid];
  
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
  const modalData = {
    content: '글을 삭제 하시겠습니까?',
    callback: () => {
      handleConfirmDelete()
    }
  };

console.log('select',selectedpost.postId)
  return (
    <div className='postDetail'>
      <div className='layout'>
          <div className='postDetail__content'>
            <div className='postDetail__title'>
              {selectedpost.title}
            </div>
            <div className='postDetail__info'>
              <div className='postDetail__info__author'>
                <UserProfile >{selectedpost.author}</UserProfile>
                  <div className='postDetail__info__views'> 
                    조회수 {selectedpost.views}
                  </div>
                </div>
              {uid === selectedpost.postUid ? (
                <div className='postDetail__info__edit'>
                  <Button size='s' label='수정' onClick={handleUpdatePost}/>
                  <Button size='s' label='삭제' onClick={() => openModal(modalData)}/>

                </div>
              ) : (
                <></>
              )}
            </div>
            <div className='postDetail__body'>
              <SanitizedHTML html={Object.values(selectedpost.content).join('')} />
            </div>
            <div className='postDetail__footer' key={selectedpost.postId}>
              <div className='like-box like-box-m'> 
                <button onClick={handleLike} className={`like${selectedpost.likes?.includes(uid) ? '--liked' : ''}`}/>
                {selectedpost ? (selectedpost.likes ? selectedpost.likes.length : 0) : 0}
              </div>
            </div>
          </div>
          <Comments />
        </div>
        {/* <Modal isOpen={isConfirmModalOpen}>
          <div>
            <p>포스트를 삭제하시겠습니까?</p>
            <Button label='삭제' size='s' onClick={handleConfirmDelete}/>
            <Button label='취소' size='s' onClick={() => setConfirmModalOpen(false)}/>
          </div>
        </Modal> */}
 
    </div>
  );
};


export default PostDetail;

