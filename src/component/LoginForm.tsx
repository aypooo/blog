import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
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
    <div className='login-form'>
    <h2 className='login-form__title'>Login</h2>
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
    <Button label='로그인' onClick={handleLoginClick}/>
    
  </div>
  );
};

export default LoginForm;