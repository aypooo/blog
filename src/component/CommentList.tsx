import React, { useEffect, useState } from 'react';
import { deleteComment, updateComment, writeNewComment } from '../firebase/comment';
import { useRecoilValue } from 'recoil';
import { userState ,Comment, Post, selectedPostState} from '../recoil';
import TimeAgoComponent from './TimeAgoComponent ';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import { LikeUpdate } from '../firebase/like';
import { fetchCommentData } from '../hook/fetchData';
import { useToggleLike } from '../hook/useToggleLike';

const CommentList = () => {
  const navigate = useNavigate()
  const user = useRecoilValue(userState)
  const selectedpost = useRecoilValue<Post | null>(selectedPostState);
  const {postId, postUid} = selectedpost as Post
  const [comment, setComment] = useState<Comment[]>([]);
  const [commentKeys,setCommentKeys] = useState('')
  const [newComment, setnewComment] = useState('');
  const [updatedCommentId, setUpdatedCommentId] = useState<string | null>(null);
  const [updatedComment, setUpdatedComment] = useState<string>('');
  const [likedComments, setLikedComments] = useState<string[]>([]);
  const handleWriteComment = async() => {
    if(!user.uid) {
      navigate('/login')
      return alert('로그인해주세요')
    }
    
    try {
      const commentKey = writeNewComment(postId,postUid, user.uid, user.name, newComment);
      setCommentKeys(commentKey!)
      setnewComment('')
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
    }
    const handleUpdateComment = async (commentId: string, updatedComment:string) => {
      try {
        await updateComment(postUid, postId, commentId, updatedComment);
        setComment((prevComments) => {
          return prevComments.map((comment) => 
            comment.commentId === commentId ? { ...comment, comment: updatedComment } : comment
          );
        });
        setUpdatedCommentId(null);
      } catch (error) {
        console.error('댓글 수정 오류:', error);
      }
    }
    const handleDeleteComment = async (commentId: string) => {
      try {
        await deleteComment(postUid, postId, commentId);
        setComment((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
      } catch (error) {
        console.error('댓글 삭제 오류:', error);
      }
    };
    const handleLikeComment = async (commentId: string) => {
      try {
        await LikeUpdate(`/${postId}/comments/${commentId}`, user.uid);
        if (likedComments.includes(commentId)) {
          setLikedComments((prevLikedComments) => prevLikedComments.filter((id) => id !== commentId));
        } else {
          setLikedComments((prevLikedComments) => [...prevLikedComments, commentId]);
        }
      } catch (error) {
        console.error('좋아요 업데이트 실패:', error);
      }
    };
  useEffect(() => {
    fetchCommentData(postId, setComment);

  }, [postId, commentKeys, setUpdatedCommentId, setComment]);
  console.log(comment)
  //comment.likes undefined 문제인가? 리코일 업데이트 안했던가
  return (
    <div>
      <h3>{comment ? Object.keys(comment).length : 0}개의 댓글</h3>
      <div>
        <div>
          <input type="text" value={newComment} onChange={(e) => setnewComment(e.target.value)} />
          <button onClick={handleWriteComment}>작성하기</button>
        </div>
      </div>
      <ul>
        {comment &&
          comment.map((comment: Comment) => (
            <li key={comment.commentId}>
              <p><UserProfile>{comment.author}</UserProfile></p>
              <p><TimeAgoComponent timestamp={comment.createAt}/></p>
              <p>{likedComments.filter((id) => id === comment.commentId).length}명이 좋아합니다</p>
              <button onClick={() => handleLikeComment(comment.commentId)}>
                {likedComments.includes(comment.commentId) ? '좋아요 취소' : '좋아요'}
              </button>
              {updatedCommentId === comment.commentId ? (
                <div>
                  <input type="text" value={updatedComment} onChange={(e) => setUpdatedComment(e.target.value)}/>
                  <button onClick={() => handleUpdateComment(comment.commentId, updatedComment)}>완료</button>
                </div>
                ) : (
                // 기존 댓글 표시
                <>
                  <p>{comment.comment}</p>
                  {comment.commentUid === user.uid && (
                    <>
                      <button onClick={() => setUpdatedCommentId(comment.commentId)}>수정</button>
                      <button onClick={() => handleDeleteComment(comment.commentId)}>삭제</button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};
export default CommentList;