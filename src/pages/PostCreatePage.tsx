import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Post, postsState, selectedPostState, userState } from '../recoil';
import { updatePost, writeNewPost } from '../firebase/post';
import { useNavigate, useParams } from 'react-router-dom'
const PostCreateForm: React.FC = () => {
  const {postid} = useParams()
  const navigate = useNavigate()
  const user = useRecoilValue(userState);
  const [posts, setPosts] = useRecoilState(postsState);
  const [selectedpost,setSelectedpost] = useRecoilState<Post | null>(selectedPostState);
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
      const createdAt = new Date()
      let postId: string
      if (selectedpost) {
        postId = selectedpost.postId
        await updatePost(postId, title, content);

        setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.postId === postId
            ? { ...post, title, content,} // 업데이트된 내용으로 업데이트
            : post
        )
      );
      } else {
        postId = await writeNewPost(user.uid, user.name!, title, content, createdAt);
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
          setSelectedpost(newPost)
        }
      }
      setTitle('');
      setContent('');
      navigate(`/${selectedpost?.author}`)
      // navigate(`/${selectedpost?.author}/${selectedpost?.postId}`)
      // recoil 업데이트가 안됨, 수정해야함
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
    }
  },[postid, selectedpost,setSelectedpost])

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

      {selectedpost && selectedpost.postId ? (
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
