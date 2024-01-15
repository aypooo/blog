import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Post, postsState, selectedPostState, userState } from '../recoil';
import { deletePost, updateViews } from '../firebase/post';
import { useNavigate } from 'react-router-dom';
import CommentList from '../component/CommentList';
import UserProfile from '../component/UserProfile';
import SanitizedHTML from '../hook/SanitizedHTML';
import { useToggleLike } from '../hook/useToggleLike';
import { LikeUpdate } from '../firebase/like';

const PostDetail: React.FC = () => {
  const navigate = useNavigate()
  const { uid } = useRecoilValue(userState);
  const [selectedpost,setSelectedPost] = useRecoilState<Post | null>(selectedPostState);
  const [posts, setPosts] = useRecoilState(postsState)
  const [liked, setLiked] = useState(false)
  const toggleLike = useToggleLike(selectedpost ? selectedpost.postId : "" , uid);


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
      ))}
      const timeoutId = setTimeout(() => {
        handleUpdateViews()
      }, 10);
    
      return () => clearTimeout(timeoutId);
  }, [selectedpost]);

  if (!selectedpost) {
    navigate('/')
    return null;
  } 
  
  const handleUpdatePost = () => {
    navigate(`/write/${selectedpost.postId}`)
  }
  const handleDeletePost = async () => {
    try {
      window.confirm("삭제하시겠습니까?")
      await deletePost(selectedpost.postId, selectedpost.postUid);
      setPosts((prevUserPosts) => prevUserPosts.filter((post) => post.postId !== selectedpost.postId));
      setSelectedPost(null);
      alert('포스트가 성공적으로 삭제되었습니다.');
      navigate(`/${selectedpost.author}`)
    } catch (error) {
      console.error('포스트 삭제 중 오류 발생:', error);
    }
  };
  const handleLike = async () => {
    try {
      await LikeUpdate(selectedpost.postId, uid);
      // 성공적으로 서버에서 좋아요 토글이 완료된 경우 Recoil 상태 업데이트
      toggleLike()
      setLiked(!liked)
      console.log(liked)
    } catch (error) {
      console.error('좋아요 토글 중 오류 발생:', error);
    }
  };

  return (
    <div className='container'>
    {posts
      .filter((post) => post.postId === selectedpost.postId)
      .map((post) => (
      <div className='postDetail'>
        <div className='postDetail__title'>
          {Object.values(post.title)}
        </div>
        <div className='postDetail__info'>
          <div className='postDetail__info__author'>
            <UserProfile >{post.author}</UserProfile>
              <div className='postDetail__info__views'> 
                조회수 {post.views}
              </div>
            </div>
          {uid === post.postUid ? (
            <div className='postDetail__edit'>
              <button className='postDetail__edit__update' onClick={handleUpdatePost}>
                수정
              </button>
              <button className='postDetail__edit__delete' onClick={handleDeletePost}>
                삭제
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className='postDetail__body'>
          <SanitizedHTML html={Object.values(post.content).join('')} />
        </div>
        <div className='postDetail__footer' key={post.postId}>
          <div className='postDetail__footer__likes'> {post ? (post.likes ? post.likes.length : 0) : 0}</div>
          <button className='postDetail__footer__like-button' onClick={handleLike}>
            <span>{post.likes ? (post.likes?.includes(uid) ? '♥️' : '좋아요') : '좋아요'}</span>
          </button>
        </div>
      </div>
      ))}
      <CommentList />
    </div>
  );
};


export default PostDetail;

