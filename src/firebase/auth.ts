import { getDatabase, ref, set,onValue, query, orderByChild, equalTo } from "firebase/database";
import { db } from "./firebase";
import { User } from "../recoil";

export async function writeUserData(uid: string, email: string, name: string):Promise<void> {
  const userRef = ref(db, 'users/' + uid);
  
  set(userRef, {
    uid: uid,
    email: email,
    name: name,
    // profile_picture: imageUrl
  });
}

// 사용자 데이터 읽기
export async function readUserData(uid: string): Promise<User | null> {
  const db = getDatabase();
  const userRef = ref(db, 'users/' + uid);

  return new Promise((resolve, reject) => {
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      resolve(userData);
    }, (error) => {
      reject(error);
    });
  });
}
export async function readAuthorData(name: string): Promise<User | null> {
  const db = getDatabase();
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

export async function readAllUserData(): Promise<User | null> {
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