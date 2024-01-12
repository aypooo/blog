import { Post,Comment } from "../recoil";
import { readAuthorPostData, readLimitedPostData, readPostData } from "../firebase/post";
import { readCommentData } from "../firebase/comment";


export const fetchPostData = async (setPosts: (posts: Post[]) => void) => {
  try {
    const userPost = await readPostData();
    const postArray = Object.entries(userPost).map(([postId, post]) => ({
      author: post.author,
      content: post.content,
      comments: post.comments,
      createAt: post.createAt,
      likes: post.likes,
      imageUrls: post.imageUrls,
      postId,
      postUid: post.postUid,
      title: post.title,
      views:post.views,

    }));
    setPosts(postArray);
    console.log('패치함=>',postArray)
  } catch (error) {
    console.error('유저 포스트 불러오기에 실패', error);
  }
};

export const fetchAuthorPostData = async (setPosts: (posts: Post[]) => void,author:string) => {
  try {
    const userPost = await readAuthorPostData(author);
    const postArray = Object.entries(userPost).map(([postId, post]) => ({
      author: post.author,
      content: post.content,
      comments: post.comments,
      createAt: post.createAt,
      likes: post.likes,
      imageUrls: post.imageUrls,
      postId,
      postUid: post.postUid,
      title: post.title,
      views:post.views,

    }));
    setPosts(postArray);
    console.log('패치함=>',postArray)
  } catch (error) {
    console.error('유저 포스트 불러오기에 실패', error);
  }
};


export const fetchMorePosts = async (setPosts: (valOrUpdater: Post[] | ((currVal: Post[]) => Post[])) => void,setLastPostKey:(postId:string)=>void, lastPostKey:string) => {
 
  try {
    console.log('fetchMorePosts')
    const userPost = await readLimitedPostData(lastPostKey);
    const userPostLength = Object.keys(userPost).length
    if (userPostLength > 0) {
      // setLastPostKey(Object.keys(userPost)[userPostLength - 1]); //마지막 키
      setLastPostKey(Object.keys(userPost)[0]); //처음 키
    }else {
      return false;
    }
    const postArray = Object.entries(userPost).map(([postId, post]) => ({
      author: post.author,
      content: post.content,
      comments: post.comments,
      createAt: post.createAt,
      likes: post.likes,
      imageUrls: post.imageUrls,
      postId,
      postUid: post.postUid,
      title: post.title,
      views:post.views,
    }));
    setPosts((prevPosts) => [...postArray, ...prevPosts]);
    console.log('패치함=>',postArray)
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
        author: comment.author,
        comment: comment.comment,
        commentId,
        createAt: comment.createAt,
        likes: comment.likes,
        postId: comment.postId,
        commentUid: comment.commentUid,
      }));
      setComment(commentsArray || []); // 만약 comments가 null이면 빈 배열로 설정
    }
  } catch (error) {
    console.error('댓글 작성 오류:', error);
  }
};
