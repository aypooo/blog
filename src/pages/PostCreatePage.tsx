import React, { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { newPostState, postsState, userState } from '../recoil';
import { writeNewPost } from '../firebase/post';  // writeNewPost 함수를 가져옵니다.

const PostCreateForm: React.FC = () => {
  const user = useRecoilValue(userState);
  const setNewPost = useSetRecoilState(newPostState);
  const setPosts = useSetRecoilState(postsState);

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
      setPosts((prevPosts) => [
        ...prevPosts,
        {
          uid: user.uid,
          postId: postId!,
          author:user.email,
          title,
          content,
          comments: [],  // Initialize comments array
          likes: 0,  // Initialize likes count
          createAt: createdAt,  // Set current date
        },
      ]);
      setTitle('');
      setContent('');
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
