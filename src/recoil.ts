import { atom, selector } from 'recoil';

export type User = {
  uid: string;
  email: string;
  name: string;
};

export type Post = {
  uid: string;
  postId: string;
  author: string;
  title: string;
  content: string;
  comments: Comment[];
  likes: number;
  createAt: string;
};
export type Comment = {
  uid: string;
  postId: string;
  author: string;
  comment: string;
  likes: number;
  createAt: string;
  commentId: string
};

export const userState = atom<User>({
  key: 'userState',
  default: { uid: '',email: '', name:''},
});

export const isLoggedInState = atom<boolean>({
  key: 'isLoggedInState',
  default: localStorage.getItem('token') ? true : false,
});

export const postsState = atom<Post[]>({
  key: 'postsState',
  default: [],
});
// export const userPostsState = atom<Post[]>({
//   key: 'userPostsState',
//   default: [],
// })
export const commentCountState = atom<number>({
  key: 'commentCountState',
  default: 0,
});

export const commentsState = atom<Comment[]>({
  key: 'commentsState',
  default: [],
});

export const userPostsSelector = selector<Post[]>({
  key: 'userPostsSelector',
  get: ({ get }) => {
    const user = get(userState);
    const posts = get(postsState);
    return posts.filter((post) => post.uid === user?.uid);
  },
});

export const selectedPostState = atom<Post | null>({
  key: 'selectedPostState',
  default: null
});

export const selectedPostIdState = atom<string>({
  key: 'selectedPostIdState',
  default: "",
});

