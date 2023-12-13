import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Post, postsState, selectedPostIdState, selectedPostState, userPostsState, userState } from '../recoil';
import { updatePost, writeNewPost } from '../firebase/post';
import { useNavigate, useParams } from 'react-router-dom'
const PostCreateForm: React.FC = () => {
  const {postid} = useParams()
  const navigate = useNavigate()
  const user = useRecoilValue(userState);
  // const [posts, setPosts] = useRecoilState(postsState);
  // const [userPosts, setUserPosts] = useRecoilState(userPostsState);
  const selectedpost = useRecoilValue<Post | null>(selectedPostState);
  const selectedpostId = useRecoilValue(selectedPostIdState);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.uid.length) {
      return alert("로그인 후 작성 가능합니다.");
    }
    try {

      const createdAt = new Date().toLocaleString();
      let postId
      if (selectedpostId) {
        postId = selectedpostId
        await updatePost(postId, title, content);
      } else {
        postId = await writeNewPost(user.uid, user.email, title, content, createdAt);
      }
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

        //객체라서 prevPosts가 작동이 안됨, 수정해야함
        // if(posts){
        //   setPosts((prevPosts) => [
        //     ...prevPosts,
        //     newPost
        //   ]);
        // }

        // if(userPosts){
        //   setUserPosts((prevPosts) => [
        //     ...prevPosts,
        //     newPost
        //   ]);
    
        // }
  
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
    }
  },[postid, selectedpost])
  

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
          <button type="submit">취소</button>
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
