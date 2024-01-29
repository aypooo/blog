import { atom, selector } from 'recoil';

export type User = {
  uid: string;
  email: string;
  name: string;
  follow?: string[];
  follower?: string[];
};

export type Post = {
  postUid: string;
  postId: string;
  author: string;
  title: string;
  content: string;
  comments: Comment[];
  likes: string[];
  imageUrls: string[];
  createAt: Date;
  views:number;
};
export type Comment = {
  commentUid: string;
  postId: string;
  author: string;
  comment: string;
  likes: string[];
  createAt: Date;
  commentId: string;
};

type ModalType = {
  isOpen: boolean;
  title: string;
  content: JSX.Element | string;
  callBack?: () => any;
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
export const userPostsState = atom<Post[]>({
  key: 'userPostsState',
  default: [],
})

export const selectedUserState = atom({
  key: 'selectedUserState',
  default: "",
});
// export const userPostsSelector = selector({
//   key: 'userPostsSelector',
//   get: ({ get }) => {
//     const allPosts = get(postsState);
//     const selectedUser = get(selectedUserState);

//     // 특정 사용자의 게시물만 필터링
//     const userPosts = Object.values(allPosts).filter(post => post.author === selectedUser);
//     return userPosts;
//   },
// });
export const uidSelector = selector<string | null>({
  key: 'uidSelector',
  get: ({ get }) => {
    const userData:User = get(userState) || {}; // 사용자 데이터가 객체임을 확인
    const userWithName = Object.values(userData).find((user) => user[2] === userData.name);

    return userWithName ? userWithName[0] : null;
  },
});
export const selectedPostState = atom<Post | null>({
  key: 'selectedPostState',
  default: null
});

export const lastPostKeyState = atom<string | null>({
  key: 'lastPostKeyState',
  default: null
});

export const modalContentState = atom<(() => JSX.Element) | null>({
  key: 'modalContentState',
  default: null,
});

export const modalState = atom<ModalType>({
  key: "modalState",
  default: {
    isOpen: false,
    title: "",
    content: ""
  }
});
