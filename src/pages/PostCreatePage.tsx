import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Post, postsState, selectedPostState, userState } from '../recoil';
import { updatePost, writeNewPost } from '../firebase/post';
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '../component/Editor';

const PostCreateForm: React.FC = () => {
  const { postid } = useParams();
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const [posts, setPosts] = useRecoilState(postsState);
  const [selectedpost, setSelectedpost] = useRecoilState<Post | null>(selectedPostState);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrls,setImageUrls] = useState([''])

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.uid.length) {
      return alert('로그인 후 작성 가능합니다.');
    }
    if (!title.length || !content.length) {
      return alert('제목과 내용을 작성해주세요');
    }
    try {
      const createdAt = new Date();
      let postId: string;

      if (selectedpost) {
        postId = selectedpost.postId;
        await updatePost(postId, title, content, imageUrls);

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.postId === postId ? { ...post, title, content, imageUrls } : post
          )
        );
      } else {
        postId = await writeNewPost(user.uid, user.name!, title, content, imageUrls, createdAt);

        const newPost: Post = {
          author: user.name,
          content,
          comments: [],
          createAt: createdAt,
          likes: 0,
          postId,
          title,
          uid: user.uid,
          imageUrls,
        };

        if (posts) {
          setPosts((prevPosts) => [...prevPosts, newPost]);
          setSelectedpost(newPost);
        }
      }

      setTitle('');
      setContent('');
      alert('글이 작성되었습니다.');
      console.log(posts);
      navigate(`/${user.name}`);
    } catch (error) {
      console.error('포스트 생성 오류: ', error);
    }
  };

  useEffect(() => {
    if (selectedpost && postid) {
      setTitle(selectedpost.title);
      setContent(selectedpost.content);
    } else {
      setSelectedpost(null);
    }
  }, [postid, selectedpost, setSelectedpost]);
  console.log(content)
  return (
    <form className="post-create-form" onSubmit={handleCreateSubmit}>
      <label className="post-create-form__label">
        <input
          placeholder="제목"
          type="text"
          className="post-create-form__input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <Editor value={content} onChange={setContent} setImageUrls={setImageUrls} />
      <div className="post-create-form__buttons">
        {selectedpost && selectedpost.postId ? (
          <>
            <button type="submit" className="post-create-form__button">
              수정
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="post-create-form__button"
            >
              취소
            </button>
          </>
        ) : (
          <>
            <button type="submit" className="post-create-form__button">
              글작성
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default PostCreateForm;
