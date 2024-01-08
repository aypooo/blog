import { Post,Comment } from "../recoil";
import { readPostData } from "../firebase/post";
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

    }));
    setPosts(postArray);
    console.log('패치함=>',postArray)
  } catch (error) {
    console.error('유저 포스트 불러오기에 실패', error);
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
