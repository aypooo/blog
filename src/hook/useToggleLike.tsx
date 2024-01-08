import { useRecoilCallback } from "recoil";
import { postsState } from "../recoil";

export const useToggleLike = (postId: string, uid: string) => {
  return useRecoilCallback(({ set }) => async () => {
    set(postsState, (prevPosts) => {
      return prevPosts.map((post) => {
        if (post.postId === postId) {
          const currentLikes = Array.isArray(post.likes) ? post.likes : [];

          // 해당 게시물인 경우 좋아요 토글
          if (currentLikes.includes(uid)) {
            // 이미 좋아요가 있는 경우 제거
            const updatedLikes = currentLikes.filter((likeUid) => likeUid !== uid);
            return { ...post, likes: updatedLikes };
          } else {
            // 좋아요가 없는 경우 추가
            const updatedLikes = [...currentLikes, uid];
            return { ...post, likes: updatedLikes };
          }
        }
        return post;
      });
    });
  });
};