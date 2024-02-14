import React from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import SignUpForm from '../component/SignupForm';
import { auth } from '../firebase/firebase';
import { writeUserData } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const navigate = useNavigate()
    const handleSignup = async ( email: string, password: string, name:string,) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          writeUserData(user.uid, user.email!, name)
          alert('회원가입이 완료되었습니다.')
          navigate('/')
          window.location.reload();
        } catch (error: any) {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode)
          console.error('로그인 오류:', errorMessage);
          if (errorCode === 'auth/email-already-in-use') {
            alert("이미 사용 중인 이메일")
          } else if (errorCode === 'auth/invalid-email') {
            alert("유효하지 않은 이메일")
            // 유효하지 않은 이메일
          } else if (errorCode === 'auth/operation-not-allowed') {
            alert("허용되지 않은 작업")
            // 허용되지 않은 작업
          } else if (errorCode === 'auth/weak-password') {
            alert("약한 비밀번호")
            // 약한 비밀번호
          } else {
        }
      };
    }
      return (
        <div className='sign-up'>
            <SignUpForm onSignup={handleSignup}/>
        </div>
      )
    }
export default SignupPage;