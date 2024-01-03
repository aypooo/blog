import React, { useEffect, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import uploadImages from '../hook/uploadImages';

interface MyEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const Editor: React.FC<MyEditorProps> = ({ value, onChange }) => {
  const quillRef = useRef<ReactQuill|null>(null);

  const handleImage = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file = input.files![0]
      // 현재 커서 위치 저장
      let quillObj = quillRef.current?.getEditor();
      const range = quillObj!.getSelection(true)!;

      // 서버에 올려질때까지 표시할 로딩 placeholder 삽입
      quillObj!.insertEmbed(range.index, "image", `/images/loading.gif`);

      try {
        // 서버에 업로드 한뒤 이미지 태그에 삽입할 url을 반환받도록 구현하면 된다 
        const filePath = `contents/temp/${Date.now()}`;
        const url = await uploadImages([file], filePath); 
        
        // 정상적으로 업로드 됐다면 로딩 placeholder 삭제
        quillObj!.deleteText(range.index, 1);
        // 받아온 url을 이미지 태그에 삽입
        quillObj!.insertEmbed(range.index, "image", url);
        
        // 사용자 편의를 위해 커서 이미지 오른쪽으로 이동
        // quillObj!.setSelection(range.index + 1);
      } catch (e) {
        quillObj!.deleteText(range.index, 1);
      }
    };
  };

    const handleEditorChange = (value: string) => {
      onChange(value);
    };
    
    const modules = useMemo(() => {
      return {
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
         handlers: {
          image: handleImage,
        },
      };
    }, []);

    return (
      <ReactQuill
      ref={quillRef}
        value={value}
        onChange={handleEditorChange}
        modules={modules}
        theme="snow"
      />
    );
  };
  
  export default Editor;
