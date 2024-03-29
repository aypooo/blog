import { ref,onValue,push,child,update,get, query, runTransaction, orderByKey, limitToLast, endBefore, orderByChild,equalTo } from "firebase/database";

import { db } from "./firebase";
import { Post } from "../recoil";


export async function writeNewPost(uid: string, name: string, title: string, content: string, imageUrls: string[],postNumber: number, createdAt: Date ): Promise<string> {

  const newPostRef = push(child(ref(db), 'posts'));
  const newPostKey = newPostRef.key;
  
  if (!newPostKey) {
    throw new Error("포스트 키를 생성하는 데 문제가 발생했습니다.");
  }
  const postData: Post = {
    author: name,
    content: content,
    createAt: createdAt,
    title: title,
    comments: [],
    likes: [],
    imageUrls: imageUrls,
    postId: newPostKey,
    postUid: uid,
    postNumber:postNumber,
    views: 0,
  };

  const updates: { [key: string]: any } = {};
  updates["/posts/" + newPostKey] = postData;
  // updates["/user-posts/" + uid + "/" + newPostKey] = postData;

  try {
    await update(ref(db), updates);
    // 새로 생성된 포스트의 키(newPostKey)를 반환합니다.
    return newPostKey;
  } catch (error) {
    console.error('포스트 생성 오류: ', error);
    throw error;
  }
}
  
  // // 유저 게시물 데이터 읽기

  export function readAuthorPostData(author: string): Promise<Post[]> {
    const postRef = ref(db, 'posts/');
  
    const queryPostByUid = query(postRef, orderByChild('author'), equalTo(author));
  
    return new Promise((resolve, reject) => {
      onValue(queryPostByUid, (snapshot) => {
        const postData: Post[] = snapshot.val() || [];
        resolve(postData);
      }, (error) => {
        console.error('포스트 데이터를 읽는 중 에러 발생:', error);
        reject(error);
      });
    });
  }
 


//게시물 데이터 읽기
  export function readPostData(): Promise<Post[]> {
    const postRef = ref(db, 'posts/');
  
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
  export function readPostDataByNumber(postNumber: string): Promise<Post | null> {
    const postRef = ref(db, `posts/`);
  
    return new Promise((resolve, reject) => {
      onValue(postRef, (snapshot) => {
        const postsData = snapshot.val();
        if (postsData) {
          // postNumber와 일치하는 post 찾기
          for(const postId in postsData){
            const post = postsData[postId];
            if (post.postNumber === Number(postNumber)) {
              resolve(post);
              return ;
            }
          }
          resolve(null);
        }else {
          resolve(null); // 해당 postId에 해당하는 포스트가 없는 경우 null 반환
        }
      }, (error) => {
        console.error(`포스트 데이터를 읽는 중 에러 발생`, error);
        reject(error);
      });
    });
  }
  export function readLimitedPostData(lastPostKey?: string): Promise<Post[]> {
    const postRef = ref(db, 'posts/');
  
    let limitedQuery = query(postRef, orderByKey(), limitToLast(10));
    // console.log('lastPostKey',lastPostKey)
    if (lastPostKey) {

      limitedQuery = query(postRef, orderByKey(), endBefore(lastPostKey), limitToLast(4));
    }
    return new Promise((resolve, reject) => {
      onValue(limitedQuery, (snapshot) => {
        const postData: Post[] = snapshot.val() || []; 
        resolve(postData);
      }, (error) => {
        console.error('포스트 데이터를 읽는 중 에러 발생:', error);
        reject(error);
      });
    });
  }
//게시물 업데이트
export async function updatePost(
  postKey: string,
  newTitle?: string,
  newContent?: string,
  newImages?: string[],
): Promise<void> {
  const postRef = ref(db, 'posts/' + postKey);

  try {
    const postSnapshot = await get(postRef);
    if (postSnapshot.exists()) {
      // const postData = postSnapshot.val();

      // 새로운 제목 또는 내용이 제공된 경우에만 업데이트
      const updates: { [key: string]: any } = {};
      if (newTitle) {
        updates.title = newTitle;
      }
      if (newContent) {
        updates.content = newContent;
      }

      if (newImages && newImages.length > 0) {
        // 이미지 업로드
        updates.imageUrls = newImages;
      }

      // 'posts' 컬렉션에서 포스트 업데이트
      await update(postRef, updates);

      // 'user-posts' 컬렉션에서도 포스트 업데이트
      // const uid = postData.uid;
      // const userPostRef = ref(db, 'user-posts/' + uid + '/' + postKey);
      // await update(userPostRef, updates);

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
  export async function deletePost (postId: string): Promise<void> {
    try {
      // 포스트가 속한 'posts'와 'user-posts' 경로에서 해당 포스트 삭제
      const updates: { [key: string]: any } = {};
      updates['/posts/' + postId] = null;
      // updates['/user-posts/' + uid + '/' + postId] = null;
  
      await update(ref(db), updates);
      console.log('포스트 삭제 성공');
    } catch (error) {
      console.error('포스트 삭제 오류:', error);
      throw error;
    }
  }
//조회수
  export async function updateViews(postId: string): Promise<void> {
    const postRef = ref(db, 'posts/' + postId);

    await runTransaction(postRef, (post) => {
      if (post) {
        if (!post.views) {
          post.views = 0;
        }
        post.views = post.views +1
        return post;
      }
    });
  }

  export async function getPostNumber(){
    try {
      const postNumberRef = ref(db,'/postNumber')
      const result = await runTransaction(postNumberRef,(currentPostNumber) => {
          if (currentPostNumber === null || currentPostNumber === undefined) {
              return 1; // 만약 postNumber가 존재하지 않으면 1부터 시작합니다.
          } else {
              return currentPostNumber + 1; // 현재 postNumber에 1을 더한 값을 반환합니다.
          }
        });
        return result.snapshot.val();
      } catch (error) {
          console.error('postNumber를 가져오는 중 오류 발생:', error);
          throw error;
      }
    };