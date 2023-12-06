import { getDatabase, ref,onValue,push,child,update } from "firebase/database";
import { db } from "./firebase";

export function writeNewPost(uid, username, title, body) {
    const postData = {
      author: username,
      uid: uid,
      body: body,
      title: title,
      starCount: 0,
    //   authorPic: picture
    };
    const newPostRef = push(child(ref(db), 'posts'));
    const newPostKey = newPostRef.key;
    console.log('username',username, 'uid',uid, 'body',body,'title', title)

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
  
    onValue(postRef, (snapshot) => {
      const userPost = snapshot.val();
      console.log(userPost);
      return userPost
    });
  }


export function readPostData(postId) {
    const postRef = ref(db, 'posts/' + postId);
  
    onValue(postRef, (snapshot) => {
      const postData = snapshot.val();
      console.log(postData);
      return postData
    });
  }