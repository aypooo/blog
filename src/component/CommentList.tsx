import React, { useEffect, useState } from 'react';
import { deleteComment, readCommentData, updateComment, writeNewComment } from '../firebase/comment';
import { useRecoilValue } from 'recoil';
import { userState ,Comment} from '../recoil';

const CommentList = ({ postId, postUid }: { postId: string, postUid:string }) => {
  const user = useRecoilValue(userState)
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [commentKeys,setCommentKeys] = useState('')
  const [comment, setComment] = useState('');
  const [updatedCommentId, setUpdatedCommentId] = useState<string | null>(null);
  const [updatedComment, setUpdatedComment] = useState<string>('');

  const handleWriteComment = async() => {
      try{
        const commentKey = writeNewComment(postId, postUid, user.uid, user.name, comment)
        setCommentKeys(commentKey!)
        alert('댓글이 작성되었습니다.')
      }catch(error){
          console.log('댓글 작성 실패', error)
      }
    }
    const handleUpdateComment = async (commentId: string, updatedComment:string) => {
      try {
        await updateComment(postUid, postId, commentId, updatedComment);
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

    //comment 재랜더 시키는것, commentKeys 삭제?
  }, [postId, commentKeys,setUpdatedCommentId]);
  //페이지네이션 붙이기?
  
  return (
    <div>
      <h3>{commentList ? Object.keys(commentList).length : 0}개의 댓글</h3>
      <div>
        <div>
          <input type="text" onChange={(e) => setComment(e.target.value)} />
          <button onClick={handleWriteComment}>작성하기</button>
        </div>
      </div>
      <ul>
        {commentList &&
          commentList.map((comment: any) => (
            <li key={comment.commentId}>
              <p>{comment.author}</p>
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