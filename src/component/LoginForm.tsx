import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  loading:boolean;
  error:string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin,loading,error }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginClick = () => {
    onLogin(email, password);
  };
  const handleSignupClick = () => {
    return  navigate("/signup")
  }
  return (
    <div className='input-layout'>
      <div className='login-form'>
      <h2 className='login-form__title'>로그인</h2>
      <input
        type="email"
        placeholder="Email"
        className='login-form__input'
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className='login-form__input'
        onChange={(e) => setPassword(e.target.value)}
      />
      <span className='login-form__sign-up-button' onClick={handleSignupClick}>회원가입</span>
      <Button isLoading={loading} fullWidth={true} label='로그인' onClick={handleLoginClick}/>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default LoginForm;