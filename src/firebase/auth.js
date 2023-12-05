import { getDatabase, ref, set,onValue } from "firebase/database";
import { db } from "./firebase";

export function writeUserData(userId, name, email, imageUrl) {
  const userRef = ref(db, 'users/' + userId);
  
  set(userRef, {
    username: name,
    email: email,
    profile_picture: imageUrl
  });
}

// 사용자 데이터 읽기
export function readUserData(userId) {
  const db = getDatabase();
  const userRef = ref(db, 'users/' + userId);

  onValue(userRef, (snapshot) => {
    const userData = snapshot.val();
    console.log(userData);
    return userData
    // 여기서 userData를 사용하여 필요한 작업 수행
  });
}