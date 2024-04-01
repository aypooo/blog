import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
 const mockOnLogin = jest.fn();
 const mockNavigate = jest.fn();

 beforeEach(() => {
   jest.clearAllMocks();
 });

 const renderComponent = (props = {}) => {
   return render(
     <Router>
       <LoginForm onLogin={mockOnLogin} loading={false} error="" {...props} />
     </Router>
   );
 };

 test('폼 필드와 버튼이 렌더링되는지 확인합니다', () => {
   renderComponent();
   expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
   expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
   expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
 });

 test('이메일과 비밀번호 입력이 잘 작동하는지 확인합니다', () => {
   renderComponent();
   const emailInput = screen.getByPlaceholderText('Email');
   const passwordInput = screen.getByPlaceholderText('Password');

   fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
   fireEvent.change(passwordInput, { target: { value: 'password123' } });

   expect(emailInput).toHaveValue('test@example.com');
   expect(passwordInput).toHaveValue('password123');
 });

 test('폼 제출 시 onLogin 함수가 올바른 값으로 호출되는지 확인합니다', () => {
   renderComponent();
   const emailInput = screen.getByPlaceholderText('Email');
   const passwordInput = screen.getByPlaceholderText('Password');
   const loginButton = screen.getByRole('button', { name: '로그인' });

   fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
   fireEvent.change(passwordInput, { target: { value: 'password123' } });
   fireEvent.click(loginButton);

   expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'password123');
 });

 test('회원가입 링크 클릭 시 navigate 함수가 /signup 경로로 호출되는지 확인합니다', () => {
   renderComponent({ navigate: mockNavigate });
   const signupLink = screen.getByRole('link', { name: '회원가입' });

   fireEvent.click(signupLink);
 });

 test('error prop이 제공될 때 에러 메시지가 표시되는지 확인합니다', () => {
   const errorMessage = 'Invalid credentials';
   renderComponent({ error: errorMessage });

   expect(screen.getByText(errorMessage)).toBeInTheDocument();
 });

});