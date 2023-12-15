import { getDatabase, ref, set,onValue } from "firebase/database";
import { db } from "./firebase";
import { User } from "../recoil";

export function writeUserData(uid: string, email: string, name: string): void {
  const userRef = ref(db, 'users/' + uid);
  
  set(userRef, {
    uid: uid,
    email: email,
    username: name,
    // profile_picture: imageUrl
  });
}

// 사용자 데이터 읽기
export function readUserData(uid: string): Promise<User | null> {
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