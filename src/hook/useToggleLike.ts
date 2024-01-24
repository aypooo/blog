import { useRecoilCallback } from "recoil";
import { Post, postsState, userPostsState } from "../recoil";

export const useToggleLike = (postId: string, uid: string) => {
  return useRecoilCallback(({ set }) => async () => {
    // 좋아요 토글 함수
    const toggleLike = (posts: Post[]) => {
      return posts.map((post) => {
        if (post.postId === postId) {
          const currentLikes = Array.isArray(post.likes) ? post.likes : [];

          // 해당 게시물인 경우 좋아요 토글
          const updatedLikes = currentLikes.includes(uid)
            ? currentLikes.filter((likeUid) => likeUid !== uid)
            : [...currentLikes, uid];

          return { ...post, likes: updatedLikes };
        }
        return post;
      });
    };

    // postsState 업데이트
    set(postsState, (prevPosts) => toggleLike(prevPosts));

    // userPostsState 업데이트
    set(userPostsState, (prevUserPosts) => toggleLike(prevUserPosts));
  });
};