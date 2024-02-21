import React, { useState } from 'react';
import { deleteComment, updateComment, writeNewComment } from '../firebase/comment';
import { useRecoilValue } from 'recoil';
import { userState ,Comment } from '../recoil';
import TimeAgoComponent from './TimeAgoComponent ';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import Button from './Button';
import Dropdown from './DropDown';
import { LikeUpdate } from '../firebase/like';

interface CommentsProps {
  commentProps: Comment[];
  postId:string, 
  postUid:string
}

const Comments: React.FC<CommentsProps> = ({ commentProps,postId,postUid }) => {
  const navigate = useNavigate()
  const user = useRecoilValue(userState)
  const [comment, setComment] = useState<Comment[]>(commentProps);
  const [newComment, setnewComment] = useState('');
  const [updatedCommentId, setUpdatedCommentId] = useState<string | null>(null);
  const [updatedComment, setUpdatedComment] = useState<string>('');
  const [likedComments, setLikedComments] = useState<string[]>([]);
  
  const handleWriteComment = async () => {
    // 사용자가 로그인하지 않은 경우
    if (!user.uid) {
      navigate('/login');
      return alert('로그인해주세요');
    }
    
    // 댓글이 비어 있는 경우
    if (newComment.length === 0) {
      return alert('댓글을 입력해주세요');
    }
  
    try {
      // 새로운 댓글 작성
      const commentKey = writeNewComment(postId, user.uid, user.name, newComment);
      // setCommentKeys(commentKey!)
      setnewComment('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };
  
  const handleUpdateComment = async (commentId: string, updatedComment: string) => {
    // 수정된 댓글이 비어 있는 경우
    if (updatedComment.length === 0) {
      return alert('댓글을 입력해주세요');
    }
  
    try {
      // 댓글 업데이트
      await updateComment(postUid, postId, commentId, updatedComment);
      // 댓글 목록 업데이트
      setComment((prevComments) => {
        return prevComments.map((comment) =>
          comment.commentId === commentId ? { ...comment, comment: updatedComment } : comment
        );
      });
      // 수정 상태 초기화
      setUpdatedCommentId(null);
    } catch (error) {
      console.error('댓글 수정 오류:', error);
    }
  };
  
  const handleDeleteComment = async (commentId: string) => {
    try {
      // 댓글 삭제
      await deleteComment(postUid, postId, commentId);
      // 삭제된 댓글 제외하고 목록 업데이트
      setComment((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };
  
  const handleLikeComment = async (commentId: string) => {
    try {
      // 좋아요 업데이트
      await LikeUpdate(`/${postId}/comments/${commentId}`, user.uid);
      // 좋아요 상태 업데이트
      if (likedComments.includes(commentId)) {
        setLikedComments((prevLikedComments) => prevLikedComments.filter((id) => id !== commentId));
      } else {
        setLikedComments((prevLikedComments) => [...prevLikedComments, commentId]);
      }
    } catch (error) {
      console.error('좋아요 업데이트 실패:', error);
    }
  };
  
    return (
      <div className="comments">
        {/* 댓글 헤더 */}
        <h3 className="comments__header">{comment ? Object.keys(comment).length : 0}개의 댓글</h3>
        
        {/* 댓글 입력 폼 */}
        <div className="comments__input-container">
          <input 
            className='comments__input' 
            type="text" 
            value={newComment} 
            onChange={(e) => setnewComment(e.target.value)} 
            placeholder="댓글을 입력하세요" 
          />
          <Button size='m' label='등록' onClick={handleWriteComment}/>
        </div>
        
        {/* 댓글 목록 */}
        <ul className="comments__comment-list">
          {comment && Object.values(comment).map((comment: Comment) => (
            <li key={comment.commentId} className="comments__comment-list__item">
              {/* 수정 중인 댓글 */}
              {updatedCommentId === comment.commentId ? (
                <>
                  <div className='comments__comment-list__item__header'>
                    <UserProfile>{comment.author}</UserProfile>
                  </div>
                  <div className="comments__input-container">
                    <input
                      className='comments__input'
                      type="text"
                      value={updatedComment || comment.comment}
                      onChange={(e) => setUpdatedComment(e.target.value)}
                    />
                    <Button label='완료' size='s' onClick={() => handleUpdateComment(comment.commentId, updatedComment)}/>
                  </div>
                </>
              ) : (
                <>
                  {/* 댓글 헤더 */}
                  <div className='comments__comment-list__item__header'>
                    <UserProfile>{comment.author}</UserProfile>
                    {/* 수정 및 삭제 옵션 */}
                    <div className="comments__comment-list__item__edit">
                      {comment.commentUid === user.uid && (
                        <Dropdown label='⋮'>
                          <div className="comments__comment-list__item__options">
                            <Button label='수정' size='s' onClick={() => {
                              setUpdatedCommentId(comment.commentId);
                              setUpdatedComment(comment.comment);
                            }} />
                            <Button label='삭제' size='s' onClick={() => handleDeleteComment(comment.commentId)} />
                          </div>
                        </Dropdown>
                      )}
                    </div>
                  </div>
                  {/* 댓글 내용 */}
                  <p className="comments__comment-list__item__content">{comment.comment}</p>
                  {/* 댓글 footer */}
                  <div className='comments__comment-list__item__footer'> 
                    <TimeAgoComponent timestamp={comment.createAt}/>
                    {/* 좋아요 */}
                    <div onClick={() => handleLikeComment(comment.commentId)} className='like-box'>
                      <button className={`like${likedComments.includes(comment.commentId) ? '--liked' : ''}`} />
                      {likedComments.filter((id) => id === comment.commentId).length}
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
};
export default Comments;