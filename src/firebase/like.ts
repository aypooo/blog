import { ref,onValue,runTransaction } from "firebase/database";
import { db } from "./firebase";

export async function LikeUpdate(path: string, uid: string): Promise<void> {
    const postRef = ref(db, 'posts/' + path);
    await runTransaction(postRef, (post) => {
      if (post) {
        if (!post.likes) {
          post.likes = [];
        }
        const index = post.likes.indexOf(uid);
        if (index !== -1) {
          // UID가 이미 있다면 삭제
          post.likes.splice(index, 1);
          console.log('delete');
        } else {
          // UID가 없다면 추가
          post.likes.push(uid);
          console.log('좋아요')
        }
      }
      return post;
    });
  }
  
  // 좋아요 데이터 읽기
  export async function readLikeData(postId: string): Promise<void> {
    const postRef = ref(db, 'posts/' + postId + '/likes');
  
    onValue(postRef, (snapshot) => {
      const likesData = snapshot.val();
      console.log(likesData);
      return likesData
      // 여기서 likesData를 사용하여 필요한 작업 수행
    });
  }

