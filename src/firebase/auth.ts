import { getDatabase, ref, set,onValue, query, orderByChild, equalTo, update } from "firebase/database";
import { db } from "./firebase";
import { User } from "../recoil";

export async function writeUserData(uid: string, email: string, name: string):Promise<void> {
  const userRef = ref(db, 'users/' + uid);
  
  set(userRef, {
    uid: uid,
    email: email,
    name: name,
  });
}
export async function updateUserData(uid: string, email: string, name: string,imageUrl:string): Promise<void> {
  const userDataRef: { [key: string]: any } = {};
  const userData: User = {
    uid: uid,
    email: email, 
    name: name,
    profile_picture: imageUrl
  };

  userDataRef['users/' + uid] = userData; 

  try {
    update(ref(db), userDataRef);
  } catch (error) {
    console.error('유저정보 업데이트 실패: ', error);
    throw error;
  }
}

// 

// 사용자 데이터 읽기
export async function readUserData(uid: string): Promise<User>  {
  const db = getDatabase();
  const userRef = ref(db, 'users/' + uid);

  return new Promise((resolve, reject) => {
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData === null) {
        // 사용자 데이터를 찾지 못한 경우, 기본값으로 빈 사용자 객체 반환
        resolve({ uid: '', email: '', name: '', follow: [], follower: [], bookmark: [] });
      } else {
        resolve(userData);
      }
    }, (error) => {
      reject(error);
    });
  });
}
export async function readAuthorData(name: string): Promise<User>  {
  const userRef = query(ref(db, 'users/'), orderByChild('name'), equalTo(name));

  return new Promise((resolve, reject) => {
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      resolve(userData);
    }, (error) => {
      reject(error);
    });
  });
}
export async function readUidData(uid: string): Promise<User> {
  const userRef = query(ref(db, 'users/'), orderByChild('uid'), equalTo(uid));

  return new Promise((resolve, reject) => {
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      resolve(userData);
    }, (error) => {
      reject(error);
    });
  });
}


export async function readAllUserData(): Promise<User>  {
  const db = getDatabase();
  const userRef = ref(db, 'users/' );

  return new Promise((resolve, reject) => {
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      resolve(userData);
    }, (error) => {
      reject(error);
    });
  });
}