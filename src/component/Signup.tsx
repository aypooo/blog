import SignUpForm from './SignupForm';
import {createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase/firebase';

const Signup = () => {
  const handleSignup = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('로그인 완료', user);
      return user;
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode)
      console.error('로그인 오류:', errorMessage);
      if (errorCode === 'auth/email-already-in-use') {
        alert("이미 사용 중인 이메일")
        // 처리 로직 추가
      } else if (errorCode === 'auth/invalid-email') {
        alert("유효하지 않은 이메일")
        // 유효하지 않은 이메일
        // 처리 로직 추가
      } else if (errorCode === 'auth/operation-not-allowed') {
        alert("허용되지 않은 작업")
        // 허용되지 않은 작업
        // 처리 로직 추가
      } else if (errorCode === 'auth/weak-password') {
        alert("약한 비밀번호")
        // 약한 비밀번호
        // 처리 로직 추가
      } else {
    }
  };
}
  return (
    <div>
        <SignUpForm onSignup={handleSignup}/>
    </div>
  )
}
export default Signup;