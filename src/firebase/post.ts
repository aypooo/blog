import { ref,onValue,push,child,update,get } from "firebase/database";
import { db } from "./firebase";

export async function writeNewPost(uid: string, username: string, title: string, content: string, createdAt: string): 
Promise<string> {
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
  if (!newPostKey) {
    throw new Error("포스트 키를 생성하는 데 문제가 발생했습니다.");
  }

  const updates: { [key: string]: any } = {};
  updates["/posts/" + newPostKey] = postData;
  updates["/user-posts/" + uid + "/" + newPostKey] = postData;


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

  export const readUserPost = (uid: string): Promise<any> => {
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

  export const readPostData = (postId: string): Promise<any> => {
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

//게시물 업데이트
export async function updatePost(  postKey: string,
  newTitle?: string,
  newContent?: string
): Promise<void> {
  const postRef = ref(db, 'posts/' + postKey);

  try {
    const postSnapshot = await get(postRef);
    if (postSnapshot) {
      const postData = postSnapshot.val();

      // 새로운 제목 또는 내용이 제공된 경우에만 업데이트
      const updates: { [key: string]: any } = {};
      if (newTitle) {
        updates.title = newTitle;
      }
      if (newContent) {
        updates.content = newContent;
      }

      // 'posts' 컬렉션에서 포스트 업데이트
      await update(postRef, updates);

      // 'user-posts' 컬렉션에서도 포스트 업데이트
      const uid = postData.uid;
      const userPostRef = ref(db, 'user-posts/' + uid + '/' + postKey);
      await update(userPostRef, updates);

      console.log('포스트가 성공적으로 업데이트되었습니다.');
    } else {
      console.error('해당 키에 대한 포스트를 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('포스트 업데이트 오류: ', error);
    throw error;
  }
}
  //게시물 삭제
  export const deletePost = async (postId: string, uid: string): Promise<void> => {
    try {
      // 포스트가 속한 'posts'와 'user-posts' 경로에서 해당 포스트 삭제
      const updates: { [key: string]: any } = {};
      updates['/posts/' + postId] = null;
      updates['/user-posts/' + uid + '/' + postId] = null;
  
      await update(ref(db), updates);
      console.log('포스트 삭제 성공');
    } catch (error) {
      console.error('포스트 삭제 오류:', error);
      throw error;
    }
  }