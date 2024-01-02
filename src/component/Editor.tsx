import React, { useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill 스타일을 불러옵니다.

interface MyEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const Editor: React.FC<MyEditorProps> = ({ value, onChange }) => {
  // 에디터의 옵션을 설정합니다.
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // 텍스트 서식
      [{ 'header': 1 }, { 'header': 2 }], // 제목
      [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 리스트
      [{ 'script': 'sub' }, { 'script': 'super' }], // 첨자, 윗첨자
      [{ 'indent': '-1' }, { 'indent': '+1' }], // 들여쓰기
      [{ 'direction': 'rtl' }], // 텍스트 방향
      [{ 'size': ['small', false, 'large', 'huge'] }], // 글자 크기
      [{ 'color': [] }, { 'background': [] }], // 글자색, 배경색
      [{ 'font': [] }], // 글꼴
      ['link', 'image', 'video'], // 링크, 이미지, 비디오 삽입
      ['clean'], // 모든 서식 제거
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  // 에디터 내용이 변경될 때 호출되는 콜백 함수
  const handleEditorChange = (value: string) => {
    onChange(value);
  };

  return (
    <ReactQuill
      value={value}
      onChange={handleEditorChange}
      modules={modules}
      theme="snow" // 테마 설정
    />
  );
};

export default Editor;