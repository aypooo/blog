import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Post, postsState, selectedPostState, userPostsState, userState } from '../recoil';
import { getPostNumber, updatePost, writeNewPost } from '../firebase/post';
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '../component/Editor';
import Button from '../component/Button';
import { useModal } from '../hook/useModal';

const PostCreateForm: React.FC = () => {
  const { postnumber } = useParams();
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const [posts, setPosts] = useRecoilState(postsState);
  const setUserPosts = useSetRecoilState(userPostsState);
  const [selectedpost, setSelectedpost] = useRecoilState<Post | null>(selectedPostState);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { openModal, closeModal } = useModal();
  
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.uid) {
      return openModal({
        content: '로그인 후 작성 가능합니다.',
        hasCancelButton:false,
        callback: () => {
          closeModal()
          navigate(`/login`);
        },
      });
    }
    if (!title.length || !content.length) {
      return openModal({
        content: '제목과 내용을 작성해주세요.',
        hasCancelButton:false,
        callback: () => {
          closeModal()
        },
      })
    }
    try {
      const createdAt = new Date();
      let postId: string;

      if (selectedpost && postnumber) {
        postId = selectedpost.postId;
        await updatePost(postId, title, content, imageUrls);

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.postId === postId ? { ...post, title, content, imageUrls } : post
          )
        );
        setUserPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.postId === postId ? { ...post, title, content, imageUrls } : post
          )
        )
      } else {
        const postNumber = await getPostNumber()
        postId = await writeNewPost(user.uid, user.name!, title, content, imageUrls,postNumber, createdAt);

        const newPost: Post = {
          author: user.name,
          content,
          comments: [],
          createAt: createdAt,
          likes: [],
          imageUrls,
          postId,
          postNumber:postNumber,
          title,
          postUid: user.uid,
          views:0, 
        };

        if (posts) {
          setPosts((prevPosts) => [...prevPosts, newPost]);
          setSelectedpost(newPost);
        }
      }
      setTitle('');
      setContent('');
      let text = "글이 작성되었습니다."
      if (selectedpost && postnumber) {
        text = "글이 수정되었습니다."
      }
        openModal({
          content: text,
          hasCancelButton:false,
          callback: () => {
            closeModal()
          },
        })
      
      console.log(posts);
      navigate(`/${user.name}`);
    } catch (error) {
      console.error('포스트 생성 오류: ', error);
    }
  };
  const handleCancel = () => {
    // 글 수정 중인 경우 수정 취소, 아닌 경우 페이지 뒤로 이동
    if (selectedpost && postnumber) {
      setSelectedpost(null);
      navigate(-1);
    } else {
      // 페이지 뒤로 이동
      navigate(-1);
    }
  };

  useEffect(() => {
    if (selectedpost && postnumber) {
      setTitle(selectedpost.title);
      setContent(selectedpost.content);
    } else if (postnumber && !selectedpost) {
      setSelectedpost(null);
      setTitle('')
      setContent('')
    }
  }, [postnumber, selectedpost, setSelectedpost]);

  return (
    <form onSubmit={handleCreateSubmit}>
      <div className='layout'>
        <label className="post-create-page__label">
          <input
            placeholder="제목"
            type="text"
            className="post-create-page__label__title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <div className="post-create-page__editor-container">
          <Editor data-testid="editor" value={content} onChange={setContent} setImageUrls={setImageUrls} />
        </div>
      </div>
      <div className="post-create-page__buttons-bar">
        {selectedpost && postnumber ? (
          <>
            <Button label='수정'/>
            <Button label='취소' onClick={handleCancel}/>
          </>
        ) : (
          <>
            <Button label='등록' size='l'/>
          </>
        )}
        </div>
    </form>
  );
};

export default PostCreateForm;
