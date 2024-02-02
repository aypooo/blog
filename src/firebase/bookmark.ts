import { onValue, ref, update } from "firebase/database";
import { db } from "./firebase";
import { Post } from "../recoil";

export async function bookMarkPost(userId: string, postId: string): Promise<void> {
    const bookmarkRef: { [key: string]: any } = {};
    bookmarkRef['users/' + userId + '/bookmark/' + postId ] = true; 

    try {
      update(ref(db), bookmarkRef);
    } catch (error) {
      console.error('북마크 실패: ', error);
      throw error;
    }
  }

  export async function removeBookmark(userId: string, postId: string): Promise<void> {
    const bookmarkRef: { [key: string]: any } = {};
    bookmarkRef['users/' + userId + '/bookmark' + postId] = null;
  
    try {
      update(ref(db), bookmarkRef);
    } catch (error) {
      console.error('북마크 해제 실패: ', error);
      throw error;
    }
  }
  export async function readBookmarkPostData(postIds: string[]): Promise<Post[]> {
    const postPromises: Promise<Post | null>[] = [];
  
    try {
      for (const postId of postIds) {
        const postRef = ref(db, `posts/${postId}`);
        const postPromise = new Promise<Post | null>((resolve, reject) => {
          onValue(postRef, (snapshot) => {
            const postData = snapshot.val();
            resolve(postData);
          }, (error) => {
            console.error(`postId(${postId})에 해당하는 포스트 데이터를 읽는 중 에러 발생:`, error);
            reject(error);
          });
        });
        postPromises.push(postPromise);
      }
  
      // 모든 Promise가 완료될 때까지 기다렸다가 결과를 반환
      const posts = await Promise.all(postPromises);
      return posts.filter(Boolean) as Post[];
    } catch (error) {
      console.error('포스트 데이터를 읽는 중 에러 발생:', error);
      throw error;
    }
  }
