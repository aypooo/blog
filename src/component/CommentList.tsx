import React, { useEffect, useState } from 'react';
import { deleteComment, readCommentData, updateComment, writeNewComment } from '../firebase/comment';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userState ,Comment, selectedPostState, Post, postsState} from '../recoil';
import TimeAgoComponent from './TimeAgoComponent ';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';

const CommentList = ({ postId, postUid }: { postId: string, postUid:string }) => {
  const user = useRecoilValue(userState)
  const navigate = useNavigate()
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [commentKeys,setCommentKeys] = useState('')
  const [newComment, setnewComment] = useState('');
  const setPosts = useSetRecoilState(postsState);
  const [selectedpost,setSelectedPost] = useRecoilState<Post | null>(selectedPostState);
  const [updatedCommentId, setUpdatedCommentId] = useState<string | null>(null);
  const [updatedComment, setUpdatedComment] = useState<string>('');
  console.log(selectedpost)
  const handleWriteComment = async() => {
    if(!user.uid) {
      navigate('/login')
      return alert('로그인해주세요')
    }
    
    try {
      const commentKey = writeNewComment(selectedpost!.postId, selectedpost!.uid, user.uid, user.name, newComment);
      setCommentKeys(commentKey!)
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
    }
    const handleUpdateComment = async (commentId: string, updatedComment:string) => {
      try {
        await updateComment(selectedpost!.uid, selectedpost!.postId, commentId, updatedComment);
        setCommentList((prevComments) => {
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
        setCommentList((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
      } catch (error) {
        console.error('댓글 삭제 오류:', error);
      }
    };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const comments= await readCommentData(postId);
        if(comments){
          const commentsArray = Object.entries(comments).map(([commentId, comment]) => ({
            commentId,
            author:comment.author,
            comment:comment.comment,
            createAt: comment.createAt,
            likes: comment.likes, 
            postId: comment.postId,
            uid: comment.uid,
        }));
        setCommentList(commentsArray);
        console.log(commentsArray)
        }else {
          setCommentList([])
        }
       
      } catch (error) {
        console.error('댓글 작성 오류:', error);
      }
    };
    fetchData();

  }, [postId, commentKeys,setUpdatedCommentId]);
  //페이지네이션 붙이기?
  
  return (
    <div>
      <h3>{commentList ? Object.keys(commentList).length : 0}개의 댓글</h3>
      <div>
        <div>
          <input type="text" onChange={(e) => setnewComment(e.target.value)} />
          <button onClick={handleWriteComment}>작성하기</button>
        </div>
      </div>
      <ul>
        {commentList &&
          commentList.map((comment: any) => (
            <li key={comment.commentId}>
              <p><UserProfile>{comment.author}</UserProfile></p>
              <p><TimeAgoComponent timestamp={comment.createAt}/></p>
              <p>{comment.likes}</p>
              <p>{comment.createAt}</p>
              {updatedCommentId === comment.commentId ? (
                <div>
                  <input type="text" value={updatedComment} onChange={(e) => setUpdatedComment(e.target.value)}/>
                  <button onClick={() => handleUpdateComment(comment.commentId, updatedComment)}>완료</button>
                </div>
                ) : (
                // 기존 댓글 표시
                <>
                  <p>{comment.comment}</p>
                  {comment.uid === user.uid && (
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