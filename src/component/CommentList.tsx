import React, { useEffect, useState } from 'react';
import { readCommentData, updateComment, writeNewComment } from '../firebase/comment';
import { useRecoilState, useRecoilValue } from 'recoil';
import { commentkeys, commentsCountState, userState } from '../recoil';

const CommentList = ({ postId,postUid }: { postId: string, postUid:string }) => {
  const user = useRecoilValue(userState)
  const [commentList, setCommentList] = useState<any | null>(null);
  const [commentKeys,setCommentKeys] = useRecoilState<any>(commentkeys);
  const [comment, setComment] = useState('');
  const [updatedCommentId, setUpdatedCommentId] = useState<string | null>(null);
  const [updatedComment, setUpdatedComment] = useState<string>('');

  const handleWriteComment = async() => {
      try{
         const commentKey =  writeNewComment(postId, postUid, user.uid, user.name, comment)
         console.log(commentKey)
         setCommentKeys(commentKey)
          alert('댓글이 작성되었습니다.')
      }catch(error){
          console.log('댓글 작성 실패', error)
      }
    }
    const handleUpdateComment = async (commentId: string, updatedComment:string) => {
      try {
        await updateComment(postUid, postId, commentId, updatedComment);
        // 수정이 완료되면 editingCommentId를 null로 초기화합니다.
        setUpdatedCommentId(null);
      } catch (error) {
        console.error('댓글 수정 오류:', error);
      }
    }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const comments = await readCommentData(postId);
        setCommentList(comments);
      } catch (error) {
        console.error('댓글 작성 오류:', error);
      }
    };
    fetchData();

    //comment 재랜더 시키는것  or recoil에 저장 하기 고민해봐야함, commentKeys 삭제?
  }, [postId,commentKeys]);
  //페이지네이션 붙이기
  
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
          Object.entries(commentList).reverse().map(([commentId, comment]: [string, any]) => (
            <li key={commentId}>
              <p>{comment.author}</p>
              <p>{comment.comment}</p>
              <p>{comment.likes}</p>
              <p>{comment.createAt}</p>
              {(comment.uid === user.uid) ? (
                <>
                  <button onClick={() => setUpdatedCommentId(commentId)}>수정</button>
                  {/* <button onClick={() => handleDeleteComment(commentId)}>삭제</button> */}
                </>
              ) : (
                <></>
              )}
              {/* 댓글 수정시 댓글에서 수정가능하게 배치 수정해야함 */}
              {updatedCommentId === commentId && (
                <div>
                  <input
                    type="text"
                    value={updatedComment}
                    onChange={(e) => setUpdatedComment(e.target.value)}
                  />
                  <button onClick={() => handleUpdateComment(commentId, updatedComment)}>
                    완료
                  </button>
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};
export default CommentList;