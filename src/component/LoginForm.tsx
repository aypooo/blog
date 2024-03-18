import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { Link } from 'react-router-dom';
interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  loading: boolean;
  error: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading, error }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 폼 제출 처리
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
    onLogin(email, password);
  };

  return (
    <div className='input-layout'>
      <form className='login-form' onSubmit={handleFormSubmit}>
        <h2 className='login-form__title'>로그인</h2>
        <input
          type="email"
          placeholder="Email"
          className='login-form__input'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className='login-form__input'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className='login-form__sign-up-button'>
          <Link to={"/signup"}>회원가입</Link>
        </div>
        <Button isLoading={loading} fullWidth={true} label='로그인' />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;


