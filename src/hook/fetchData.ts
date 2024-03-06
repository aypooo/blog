import { Post,Comment, User } from "../recoil";
import { readAuthorPostData, readLimitedPostData, readPostData, readPostDataByNumber } from "../firebase/post";
import { readCommentData } from "../firebase/comment";
import { readAuthorData, readUidData } from "../firebase/auth";
import { readBookmarkPostData } from "../firebase/bookmark";


export const fetchPostData = async (setPosts: (posts: Post[]) => void) => {
  try {
    const userPost = await readPostData();
    console.log(Object.entries(userPost))
    const postArray = Object.entries(userPost).map(([postId, post]) => ({
      ...post,
      postId
    }));
    setPosts(postArray);
    console.log('패치함=>',postArray)
  } catch (error) {
    console.error('유저 포스트 불러오기에 실패', error);
  }
};
export const fetchPostDataByNumber = async (setPost: (post: Post) => void,postNumber:string) => {

  try {
    const userPost = await readPostDataByNumber(postNumber);
    setPost(userPost!);
    console.log('패치함=>',userPost)
  } catch (error) {
    console.error('유저 포스트 불러오기에 실패', error);
  }
};

export const fetchAuthorPostData = async (setPosts: (posts: Post[]) => void,author:string) => {
  try {
    const userPost = await readAuthorPostData(author);
    const postArray = Object.entries(userPost).map(([postId, post]) => ({
      ...post,
      postId
    }));
    setPosts(postArray);
    console.log('패치함=>',postArray)
  } catch (error) {
    console.error('유저 포스트 불러오기에 실패', error);
  }
};
export const fetchAuthorData = async (setAuthorData: (user: User[]) => void,author:string) => {
  try {
    const authorData = await readAuthorData(author);
    setAuthorData(Object.values(authorData as unknown as User[]))
    console.log('authorData=>',authorData)
    console.log('author=>',author)
  } catch (error) {
    console.error('데이터 가져오기 실패:', error);
  }
};
export const fetchUidData = async (setAuthorData: (user: User[]) => void,uid:string) => {
  try {
    const authorData = await readUidData(uid);
    setAuthorData(Object.values(authorData as unknown as User[]))
  } catch (error) {
    console.error('데이터 가져오기 실패:', error);
  }
};
export const fetchBookmarkData = async (setBookmarkData: (bookmark: Post[]) => void,bookmark:string[]) => {
  if(!bookmark){
    return console.log('담은글 없음')
  }
  try {
      const bookmarkData = await readBookmarkPostData(bookmark)
      console.log(Object.values(bookmarkData))
      const postArray = Object.values(bookmarkData);
      setBookmarkData(postArray);
  } catch (error) {
    console.error('데이터 가져오기 실패:', error);
  }
};

export const fetchMorePosts = async (setPosts: (valOrUpdater: Post[] | ((currVal: Post[]) => Post[])) => void,setLastPostKey:(postId:string)=>void, lastPostKey:string) => {
 
  try {
    const userPost = await readLimitedPostData(lastPostKey);
    const userPostLength = Object.keys(userPost).length
    if (userPostLength > 0) {
      // setLastPostKey(Object.keys(userPost)[userPostLength - 1]); //마지막 키
      setLastPostKey(Object.keys(userPost)[0]); //처음 키

    }else {
      return false;

    }
    const postArray = Object.entries(userPost).map(([postId, post]) => ({
      ...post,
      postId
    }));
    setPosts((prevPosts) => [...postArray, ...prevPosts]);

    return true; 
  } catch (error) {
    console.error('유저 포스트 불러오기에 실패', error);
    return false; 
  }

};


export const fetchCommentData = async (postId: string,  setComment: (comments: Comment[]) => void) => {
  try {
    const comments = await readCommentData(postId);
    if (comments) {
      const commentsArray = Object.entries(comments).map(([commentId, comment]) => ({
        ...comment,
        commentId
      }));
      setComment(commentsArray || []); // 만약 comments가 null이면 빈 배열로 설정
    }
  } catch (error) {
    console.error('댓글 작성 오류:', error);
  }
};
