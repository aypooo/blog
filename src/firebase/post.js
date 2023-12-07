import { getDatabase, ref,onValue,push,child,update } from "firebase/database";
import { db } from "./firebase";

export function writeNewPost(uid, username, title, content, createdAt) {
    const postData = {
      author: username,
      uid: uid,
      content: content,
      title: title,
      Comments: [],
      likes: 0,
      createAt: createdAt
    //   authorPic: picture
    };

    const newPostRef = push(child(ref(db), 'posts'));
    const newPostKey = newPostRef.key;
    console.log('username',username, 'uid',uid, 'content',content,'title', title)

    const updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + uid + '/' + newPostKey] = postData;
    console.log("2")
    return update(ref(db), updates)
      .then(() => {
        // 새로 생성된 포스트의 키(newPostKey)를 반환합니다.
        console.log('3')
        return newPostKey;
      })
      .catch((error) => {
        console.error('포스트 생성 오류: ', error);
        throw error;
      });
  }
  
  // 게시물 데이터 읽기

  export function readUserPost(uid) {
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


  export function readPostData(postId) {
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