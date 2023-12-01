import { atom } from 'recoil';

type User = {
  uid:string;
  email:string;
  token?:string;
}

export const userState = atom<User>({
    key: 'userState',
    default:{uid:"", email:""}
  });

export const isLoggedInState = atom<boolean>({
    key:'isLoggedIn',
    default: localStorage.getItem("token")? true : false
})