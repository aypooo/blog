import { ref,onValue,push,child,update } from "firebase/database";
import { db } from "./firebase";

export async function writeNewPost(uid, username, title, content, createdAt) {
  const postData = {
    author: username,
    uid: uid,
    content: content,
    title: title,
    Comments: [],
    likes: 0,
    createAt: createdAt,
    //   authorPic: picture
  };

  const newPostRef = push(child(ref(db), 'posts'));
  const newPostKey = newPostRef.key;

  const updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  try {
    await update(ref(db), updates);
    // 새로 생성된 포스트의 키(newPostKey)를 반환합니다.
    return newPostKey;
  } catch (error) {
    console.error('포스트 생성 오류: ', error);
    throw error;
  }
}
  
  // 유저 게시물 데이터 읽기

  export const readUserPost = (uid) => {
    const postRef = ref(db, 'user-posts/' + uid);
  
    return new Promise((resolve, reject) => {
      onValue(postRef, (snapshot) => {
        const userPost = snapshot.val();
        resolve(userPost);
      }, (error) => {
        console.error('사용자 포스트를 읽는 중 에러 발생:', error);
        reject(error);
      });
    });
  }

//게시물 데이터 읽기

  export const readPostData = (postId) => {
    const postRef = ref(db, 'posts/' + postId);
  
    return new Promise((resolve, reject) => {
      onValue(postRef, (snapshot) => {
        const postData = snapshot.val();
        resolve(postData);
      }, (error) => {
        console.error('포스트 데이터를 읽는 중 에러 발생:', error);
        reject(error);
      });
    });
  }
  export const updatePost = async (postId, updatedContent) => {
    try {
      const updates = {
        [`/posts/${postId}/content`]: updatedContent,
      };
  
      await update(ref(db), updates);
      console.log('포스트 업데이트 성공');
    } catch (error) {
      console.error('포스트 업데이트 중 오류 발생:', error);
      throw error;
    }
  };
  export const deletePost = async(postId, uid) => {
    try {
      // 포스트가 속한 'posts'와 'user-posts' 경로에서 해당 포스트 삭제
      const updates = {};
      updates['/posts/' + postId] = null;
      updates['/user-posts/' + uid + '/' + postId] = null;
  
      await update(ref(db), updates);
      console.log('포스트 삭제 성공');
    } catch (error) {
      console.error('포스트 삭제 오류:', error);
      throw error;
    }
  }