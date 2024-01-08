import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Post, postsState, selectedPostState, userState } from '../recoil';
import { deletePost } from '../firebase/post';
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
    <div>
      <h2>Post Detail</h2>
      <UserProfile>{selectedpost.author}</UserProfile>
      <h3>{Object.values(selectedpost.title)}</h3>
      <SanitizedHTML html={Object.values(selectedpost.content).join('')}/>
   
 
      {posts
        .filter(post => post.postId === selectedpost.postId)
        .map(filteredPost => (
          <div key={filteredPost.postId}>
            <div > {filteredPost? (filteredPost.likes ? (filteredPost.likes.length) : 0) : 0}</div>
            <button onClick={handleLike}>
              <span>{filteredPost.likes ? (filteredPost.likes?.includes(uid) ? ('♥️') : '좋아요'):'좋아요'}</span>
            </button>
          </div>
        ))}
      {uid === selectedpost.postUid ? (
        <>
          <button onClick={handleUpdatePost}>수정</button>
          <button onClick={handleDeletePost}>삭제</button>
        </>
      ):(
        <></>
      ) }
      <CommentList />
    </div>
  );
};

export default PostDetail;

