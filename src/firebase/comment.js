import { getDatabase, ref,onValue,push,child,update } from "firebase/database";
import { db } from "./firebase";

export function writeNewComment(postId, uid, username, commentText) {

    const commentData = {
      uid: uid,
      author: username,
      text: commentText
    };
  
    const newCommentKey = push(child(ref(db), 'comments/' + postId)).key;
  
    const updates = {};
    updates['/comments/' + postId + '/' + newCommentKey] = commentData;
  
    return update(ref(db), updates);
  }
  
  // 댓글 데이터 읽기
export function readCommentData(postId) {
    const db = getDatabase();
    const commentsRef = ref(db, 'comments/' + postId);
  
    onValue(commentsRef, (snapshot) => {
      const commentsData = snapshot.val();
      console.log(commentsData);
      return commentsData
      // 여기서 commentsData를 사용하여 필요한 작업 수행
    });
  }