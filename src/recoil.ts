import { atom, selector } from 'recoil';

export type User = {
  uid: string;
  email: string;
};

export type Post = {
  uid: string;
  postId: string;
  title: string;
  content: string;
  comments: Comment[];
  likes: number;
  createAt: Date;
};

export type Comment = {
  uid: string;
  postId: string;
  content: string;
  likes: number;
  createAt: Date;
};

export const userState = atom<User>({
  key: 'userState',
  default: { uid: '', email: '' },
});

export const isLoggedInState = atom<boolean>({
  key: 'isLoggedInState',
  default: localStorage.getItem('token') ? true : false,
});

export const postsState = atom<Post[]>({
  key: 'postsState',
  default: [],
});

export const commentsState = atom<Comment[]>({
  key: 'commentsState',
  default: [],
});

export const userPostsSelector = selector({
  key: 'userPostsSelector',
  get: ({ get }) => {
    const user = get(userState);
    const posts = get(postsState);
    return posts.filter((post) => post.uid === user?.uid);
  },
});

export const singlePostState = atom<Post | null>({
  key: 'singlePostState',
  default: null,
});

export const selectedPostIdState = atom<string | null>({
  key: 'selectedPostIdState',
  default: null,
});

export const newPostState = atom<Post | null>({
  key: 'newPostState',
  default: null,
});