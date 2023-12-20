import { ref,onValue,push,child,update, get, remove } from "firebase/database";
import { Comment } from "../recoil";
import { db } from "./firebase";

// 댓글 쓰기
export function writeNewComment(postId: string, postUid:string,  uid: string, name: string, comment: string) {
  const commentData: Comment = {
    author: name,
    comment: comment,
    commentId:'',
    postId: postId,
    createAt: new Date(),
    likes: 0,
    uid: uid,
  };

  const newCommentKey = push(child(ref(db), 'comments/' + postId)).key;

  const updates: { [key: string]: any } = {};
  updates['posts/' + postId + '/' + 'comments/' + newCommentKey] = commentData;
  updates["/user-posts/" + postUid + '/' + postId +'/' + 'comments/' + newCommentKey] = commentData;
  
  try {
    update(ref(db), updates);
    return newCommentKey;
  } catch (error) {
    console.error('댓글 생성 오류: ', error);
    throw error;
  }
}
  // 댓글 데이터 읽기
  export function readCommentData(postId: string): Promise<Comment[]> {
    const commentsRef = ref(db, 'posts/' + postId + '/' + 'comments');
  
    return new Promise((resolve,reject) => {
      onValue(commentsRef, (snapshot) => {
        const commentsData = snapshot.val();
        resolve(commentsData)
      },(error) => {
        console.error('댓글을 읽는 중 에러 발생:', error);
        reject(error);
      });
    })
  }

  // 댓글 업데이트

  export async function updateComment(postUid:string, postId: string, commentId: string, updatedText: string): Promise<void> {
    const commentRef = ref(db, 'posts/' + postId+ '/' + 'comments/' + commentId);
    const userPostCommentRef = ref(db, 'user-posts/' + postUid + '/' + postId + '/' + 'comments/' + commentId);
    try {
      const commentSnapshot = await get(commentRef);
      if (commentSnapshot) {
        //posts/comments에 업데이트
        await update(commentRef, {
          comment: updatedText,
        });
        //user-posts/comments에 업데이트
        await update(userPostCommentRef, {
          comment: updatedText,
        });
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  //댓글 삭제

  export async function deleteComment(postUid: string, postId: string, commentId: string): Promise<void> {
    const commentRef = ref(db, 'posts/' + postId+ '/' + 'comments/' + commentId);
    const userPostCommentRef = ref(db, '/user-posts/' + postUid + '/' + postId +'/' + 'comments/' + + commentId);
  
    try {
      // 댓글 삭제
      await remove(commentRef);
      // 사용자의 게시물에서도 댓글 삭제
      await remove(userPostCommentRef);
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
      throw error;
    }
  }