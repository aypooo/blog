import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PostCreateForm from './PostCreatePage';
import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';


describe('PostCreateForm', () => {
  test('폼이 입력 필드와 버튼을 제대로 렌더링하는지 확인합니다.', async () => {
    render(
      <RecoilRoot>
        <MemoryRouter>
          <PostCreateForm />
        </MemoryRouter>
      </RecoilRoot>
    );
    
    // 입력 필드가 제대로 렌더링되는지 확인합니다.
    expect(screen.getByPlaceholderText('제목')).toBeInTheDocument();

    // 버튼이 제대로 렌더링되는지 확인합니다.
    expect(screen.getByText('등록')).toBeInTheDocument();
    expect(screen.queryByText('수정')).not.toBeInTheDocument();
    expect(screen.queryByText('취소')).not.toBeInTheDocument();
  });

  test('사용자 입력을 제대로 처리하는지 확인합니다.', async () => {
    render(
      <RecoilRoot>
        <MemoryRouter>
          <PostCreateForm />
        </MemoryRouter>
      </RecoilRoot>
    );

    // 제목 입력 필드에 값을 입력합니다.
    const titleInput = screen.getByPlaceholderText('제목');
    fireEvent.change(titleInput, { target: { value: '테스트 제목' } });
    expect(titleInput).toHaveValue('테스트 제목');
  });
});