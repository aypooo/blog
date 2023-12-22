import { Post, User } from "../recoil";
import { readPostData } from "../firebase/post";

const FetchPostData = async (uid: string, setPosts: (posts: Post[]) => void) => {
  try {
    const userPost = await readPostData(uid);
    const postArray = Object.entries(userPost).reverse().map(([postId, post]) => ({
      postId,
      author: post.author,
      content: post.content,
      comments: post.comments,
      createAt: post.createAt,
      likes: post.likes,
      title: post.title,
      uid: post.uid,
    }));
    setPosts(postArray);
  } catch (error) {
    console.error('유저 포스트 불러오기에 실패', error);
  }
};

export default FetchPostData;