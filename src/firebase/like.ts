import { getDatabase, ref,onValue,runTransaction } from "firebase/database";
import { db } from "./firebase";

export function toggleLike(postId: string, uid: string): void {
    const postRef = ref(db, 'posts/' + postId);
  
    runTransaction(postRef, (post) => {
      if (post) {
        if (post.likes && post.likes[uid]) {
          post.likeCount--;
          post.likes[uid] = null;
        } else {
          post.likeCount++;
          if (!post.likes) {
            post.likes = {};
          }
          post.likes[uid] = true;
        }
      }
      return post;
    });
  }
  
  // 좋아요 데이터 읽기
  export function readLikeData(postId: string): void {
    const db = getDatabase();
    const postRef = ref(db, 'posts/' + postId + '/likes');
  
    onValue(postRef, (snapshot) => {
      const likesData = snapshot.val();
      console.log(likesData);
      return likesData
      // 여기서 likesData를 사용하여 필요한 작업 수행
    });
  }