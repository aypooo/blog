import React from 'react';
import { RecoilState, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Post, selectedPostIdState, selectedPostState, userPostsState, userState } from '../recoil';
import { deletePost } from '../firebase/post';
import { useNavigate } from 'react-router-dom';

const PostDetail: React.FC = () => {
  const navigate = useNavigate()
  const { uid } = useRecoilValue(userState);
  const [selectedpost,setSelectedPost] = useRecoilState<Post | null>(selectedPostState);
  const [selectedpostId, setSelectedPostId] = useRecoilState(selectedPostIdState);
  const setUserPosts = useSetRecoilState(userPostsState)
  if (!selectedpost) {
    return null;
  }
  
  const handlePostUpdate = () => {
    navigate(`/write/${selectedpostId}`)
  }
  const handleDeletePost = async () => {
    try {
      window.confirm("삭제하시겠습니까?")
      await deletePost(selectedpostId, selectedpost.uid);
      setUserPosts((prevUserPosts) => Object.values(prevUserPosts).filter((post) => post.postId !== selectedpostId));
      setSelectedPost(null);
      setSelectedPostId('');
      alert('포스트가 성공적으로 삭제되었습니다.');
      navigate('/post')
    } catch (error) {
      console.error('포스트 삭제 중 오류 발생:', error);
    }
  };

  return (
    <div>
      <h2>Post Detail</h2>
      <h3>{Object.values(selectedpost.title)}</h3>
      <p>{Object.values(selectedpost.content)}</p>
      {uid === selectedpost.uid ? (
        <>
          <button onClick={handlePostUpdate}>수정</button>
          <button onClick={handleDeletePost}>삭제</button>
        </>
      ):(
        <></>
      ) }
      
    </div>
  );
};

export default PostDetail;

