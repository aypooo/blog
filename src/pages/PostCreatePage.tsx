import React, { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { postsState, userPostsState, userState } from '../recoil';
import { writeNewPost } from '../firebase/post';
import { useNavigate } from 'react-router-dom'
const PostCreateForm: React.FC = () => {
  const navigate = useNavigate()
  const user = useRecoilValue(userState);
  const setPosts = useSetRecoilState(postsState);
  const setUserPosts = useSetRecoilState(userPostsState);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(user)
    if (!user) {
      return;
    }
    try {
      const createdAt = new Date().toLocaleString();
      const postId = await writeNewPost(user.uid, user.email, title, content, createdAt);
      // Recoil 상태 업데이트
      const newPost =    {
          uid: user.uid,
          postId: postId!,
          author:user.email,
          title,
          content,
          comments: [],  
          likes: 0, 
          createAt: createdAt,
        }
      // setPosts((prevPosts) => [
      //   ...prevPosts,
      //   newPost
      // ]);
      // setUserPosts((prevPosts) => [
      //   ...prevPosts,
      //   newPost
      // ]);

      setTitle('');
      setContent('');
      navigate("/post")
    } catch (error) {
      console.error('포스트 생성 오류: ', error);
    }
  };
  

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
      <br />
      <button type="submit">Create</button>
    </form>
  );
};

export default PostCreateForm;
