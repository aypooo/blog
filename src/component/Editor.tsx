import React, { useEffect, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import uploadImages from '../hook/uploadImages';

interface MyEditorProps {
  value: string;
  onChange: (content: string) => void;
  setImageUrls: (url: string[]) => void;
}

const Editor: React.FC<MyEditorProps> = ({ value, onChange, setImageUrls }) => {
  const quillRef = useRef<ReactQuill|null>(null);

  const imageHandler = () => {
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
        const url = await uploadImages([file], 'postImage', 700); 
        setImageUrls(url)
        // 정상적으로 업로드 됐다면 로딩 placeholder 삭제
        quillObj!.deleteText(range.index, 1);
        // 받아온 url을 이미지 태그에 삽입
        quillObj!.insertEmbed(range.index, "image", url[0]);
        
        // 사용자 편의를 위해 커서 이미지 오른쪽으로 이동
       quillObj!.setSelection({ index: range.index + 1, length: 0 });
      } catch (e) {
        quillObj!.deleteText(range.index, 1);
      }
    };
  };

    const handleEditorChange = (value: string) => {
      onChange(value);
    };
    const modules = useMemo(
      () => ({
        toolbar: {
          container: [
            [{ header: '1' }, { header: '2' }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
            ['image'],
          ],
          handlers: { image: imageHandler },
        },
        clipboard: {
          matchVisual: false,
        },
      }),
      [],
    );
    const formats = [
      'header',
      'font',
      'size',
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'list',
      'bullet',
      'align',
      'image',
    ];
  
    return (
      <ReactQuill
        ref={quillRef}
          value={value}
          onChange={handleEditorChange}
          modules={modules}
          formats={formats}
          theme="snow"
          placeholder= "글을 작성해 주세요." 
          style={{
            height:"450px",
            margin:"0 0 30px 0",
            padding:"0px 0px 30px 0px",
            lineHeight:"0px",
          }}
      />
    );
  };
  
  export default Editor;
