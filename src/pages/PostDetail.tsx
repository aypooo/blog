import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Post, postsState, selectedPostIdState, selectedPostState, userState } from '../recoil';
import { deletePost } from '../firebase/post';
import { useNavigate } from 'react-router-dom';
import CommentList from '../component/CommentList';

const PostDetail: React.FC = () => {
  const navigate = useNavigate()
  const { uid } = useRecoilValue(userState);
  const [selectedpost,setSelectedPost] = useRecoilState<Post | null>(selectedPostState);
  const [selectedpostId, setSelectedPostId] = useRecoilState(selectedPostIdState);
  const setPosts = useSetRecoilState(postsState)
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
      setPosts((prevUserPosts) => prevUserPosts.filter((post) => post.postId !== selectedpostId));
      setSelectedPost(null);
      setSelectedPostId('');
      alert('포스트가 성공적으로 삭제되었습니다.');
      navigate('/userpost')
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
      <CommentList postId={selectedpostId} postUid={selectedpost.uid}/>
    </div>
  );
};

export default PostDetail;

