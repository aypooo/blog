import React, { useEffect, useRef, useState } from 'react';
import { deleteComment, updateComment, writeNewComment } from '../firebase/comment';
import { useRecoilValue } from 'recoil';
import { userState ,Comment, Post, selectedPostState} from '../recoil';
import TimeAgoComponent from './TimeAgoComponent ';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import { LikeUpdate } from '../firebase/like';
import { fetchCommentData } from '../hook/fetchData';
import { useToggleLike } from '../hook/useToggleLike';
import Button from './Button';
import Dropdown from './DropDown';

const Comments = () => {
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
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
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
    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSelectedCommentId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  const handleOptionButtonClick = (event: React.MouseEvent, commentId: string) => {
    event.stopPropagation(); // 옵션 버튼 클릭 시 이벤트 전파 방지
    setSelectedCommentId(selectedCommentId === commentId ? null : commentId);
  };
  return (
    <div className="comments">
      <h3 className="comments__header">{comment ? Object.keys(comment).length : 0}개의 댓글</h3>
      <div className="comments__input-container">
        <div>
          <input type="text" value={newComment} onChange={(e) => setnewComment(e.target.value)} />
          <Button label='작성하기' onClick={handleWriteComment}/>
        </div>
      </div>
      <ul className="comments__comment-list">
        {comment &&
          comment.map((comment: Comment) => (
            <li key={comment.commentId} className="comments__comment-list__item">
                {updatedCommentId === comment.commentId ? (
                  <>
                    <div className='comments__comment-list__item__header'>
                      <UserProfile>{comment.author}</UserProfile>
                    </div>
                    <div className="comments__comment-list__item__input">
                      <input
                        type="text"
                        value={updatedComment || comment.comment}
                        onChange={(e) => setUpdatedComment(e.target.value)}
                      />
                      <Button className='edit' label='완료' onClick={() => handleUpdateComment(comment.commentId, updatedComment)}/>
                    </div>
                  </>
                ) : (
                <>
                  <div className='comments__comment-list__item__header'>
                    <UserProfile>{comment.author}</UserProfile>
                    <div className="comments__comment-list__item__edit">
                      {comment.commentUid === user.uid && (
                          <Dropdown label='⋮'>
                            <div className="comments__comment-list__item__options">
                              <Button className="drop-down__content__item" label='수정' onClick={() => {
                                setUpdatedCommentId(comment.commentId);
                                setUpdatedComment(comment.comment);
                              }} />
                              <Button className="drop-down__content__item" label='삭제' onClick={() => {
                                handleDeleteComment(comment.commentId);
                              }} />
                            </div>
                          </Dropdown>
                      )}
                    </div>
                  </div>
                  <p className="comments__comment-list__item__content">{comment.comment}</p>
                  <div className='comments__comment-list__item__footer'> 
                    <TimeAgoComponent timestamp={comment.createAt}/>
                    <div className='like-box'>
                      <Button
                        className={`like${likedComments.includes(comment.commentId) ? '--liked' : ''}`}
                        size='m'
                        onClick={() => handleLikeComment(comment.commentId)}
                        label=''
                      />
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