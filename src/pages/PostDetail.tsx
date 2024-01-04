import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Post, postsState, selectedPostState, userState } from '../recoil';
import { deletePost } from '../firebase/post';
import { useNavigate } from 'react-router-dom';
import CommentList from '../component/CommentList';
import UserProfile from '../component/UserProfile';
import SanitizedHTML from '../hook/SanitizedHTML';

const PostDetail: React.FC = () => {
  const navigate = useNavigate()
  const { uid } = useRecoilValue(userState);
  const [selectedpost,setSelectedPost] = useRecoilState<Post | null>(selectedPostState);
  const setPosts = useSetRecoilState(postsState)
  if (!selectedpost) {
    return null;
  }
  
  const handlePostUpdate = () => {
    navigate(`/write/${selectedpost.postId}`)
  }
  const handleDeletePost = async () => {
    try {
      window.confirm("삭제하시겠습니까?")
      await deletePost(selectedpost.postId, selectedpost.uid);
      setPosts((prevUserPosts) => prevUserPosts.filter((post) => post.postId !== selectedpost.postId));
      setSelectedPost(null);
      alert('포스트가 성공적으로 삭제되었습니다.');
      navigate(`/${selectedpost.author}`)
    } catch (error) {
      console.error('포스트 삭제 중 오류 발생:', error);
    }
  };

  return (
    <div>
      <h2>Post Detail</h2>

      <UserProfile>{selectedpost.author}</UserProfile>
      <h3>{Object.values(selectedpost.title)}</h3>
      <SanitizedHTML html={Object.values(selectedpost.content).join('')}/>
      {uid === selectedpost.uid ? (
        <>
          <button onClick={handlePostUpdate}>수정</button>
          <button onClick={handleDeletePost}>삭제</button>
        </>
      ):(
        <></>
      ) }
      <CommentList postId={selectedpost.postId} postUid={selectedpost.uid}/>
    </div>
  );
};

export default PostDetail;

