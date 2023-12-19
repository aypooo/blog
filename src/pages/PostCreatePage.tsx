import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Post, postsState, selectedPostIdState, selectedPostState, userState } from '../recoil';
import { updatePost, writeNewPost } from '../firebase/post';
import { useNavigate, useParams } from 'react-router-dom'
const PostCreateForm: React.FC = () => {
  const {postid} = useParams()
  const navigate = useNavigate()
  const user = useRecoilValue(userState);
  const [posts, setPosts] = useRecoilState(postsState);
  const [selectedpost,setSelectedpost] = useRecoilState<Post | null>(selectedPostState);
  const [selectedpostId,setSelectedpostId] = useRecoilState<string>(selectedPostIdState);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  console.log(posts)
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.uid.length) {
      return alert("로그인 후 작성 가능합니다.");
    }
    if(!title.length || !content.length){
      return alert('제목과 내용을 작성해주세요')
    }
    try {
      const createdAt = new Date().toLocaleString();
      let postId: string
      if (selectedpostId) {
        postId = selectedpostId
        await updatePost(postId, title, content);
      } else {
        postId = await writeNewPost(user.uid, user.name!, title, content, createdAt);
      }
      // Recoil 상태 업데이트
      const newPost = {
          author:user.name,
          content,
          comments: [],  
          createAt: createdAt,
          likes: 0, 
          postId:postId,
          title,
          uid: user.uid,
        }
        if(posts){
          setPosts((prevPosts) => [...prevPosts,newPost]);
        }
  
      setTitle('');
      setContent('');
      navigate("/userpost")
    } catch (error) {
      console.error('포스트 생성 오류: ', error);
    }
  };
  useEffect(() => {
    if(selectedpost && postid){
      setTitle(selectedpost.title)
      setContent(selectedpost.content)
    } else {
      setSelectedpost(null)
      setSelectedpostId('')
    }
  },[postid, selectedpost,setSelectedpost, setSelectedpostId])
  return (
    <form onSubmit={handleCreateSubmit}>
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <br />
      <label>
        Content:
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      </label>

      {selectedpostId ? (
        <>
          <button type="submit">수정</button>    
          <button onClick={() =>navigate(-1)} >취소</button>
        </>
      ):(
        <>        
          <button type="submit">글작성</button>
        </>

      )}

    </form>
  );
};

export default PostCreateForm;
