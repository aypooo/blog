import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import PostList from './PostList';
import { MemoryRouter } from 'react-router-dom';
import { Post, postsState, selectedPostState, userPostsState } from '../recoil';
import * as postUpdateFunctions from '../firebase/post';

// 모킹 데이터
  const mockPost : Post[] = [
    {
      postUid: '1',
      postId: 'postId1',
      author: 'author1',
      title: 'title1',
      content: 'content1',
      likes: ['user1', 'user2'], 
      comments: [
        {
          commentUid: '1',
          postId: 'postId1',
          author: 'commentAuthor1',
          comment: 'comment1',
          likes: [],
          createAt: new Date(),
          commentId: 'commentId1'
        },
      ],
      imageUrls: ['url1', 'url2'], 
      createAt: new Date(),
      postNumber:1,
      views: 72,
    },
  ];

// 외부 함수 모킹
jest.mock('../firebase/post', () => ({
  updateViews: jest.fn(),
}));

describe('PostList 컴포넌트', () => {
  beforeEach(() => {
    
    // updateViews 모킹 초기화
    (postUpdateFunctions.updateViews as jest.Mock).mockResolvedValue(void 0);
  });

  it('포스트 목록을 올바르게 렌더링한다', async () => {
    render(
      <RecoilRoot initializeState={(snap) => {
        snap.set(postsState, mockPost);
        snap.set(selectedPostState, null);
        snap.set(userPostsState, mockPost);
      }}>
        <MemoryRouter>
          <PostList posts={mockPost} label="test-label" />
        </MemoryRouter>
      </RecoilRoot>
    );

      const postItem = screen.getByTestId(`post-item-${0}`);
      const imageElement = screen.getByTestId(`post-image`);
      
      expect(screen.getByText(/title1/i)).toBeInTheDocument();
      expect(screen.getByText(/방금 전/i)).toBeInTheDocument();
      expect(screen.getByText(/조회수 72/i)).toBeInTheDocument();
      expect(postItem).toBeInTheDocument();
      expect(imageElement).toBeInTheDocument();
  });

  // it.skip('포스트 클릭 시 조회수 업데이트와 네비게이션 동작을 검증한다', async () => {
  //   render(
  //     <RecoilRoot>
  //       <MemoryRouter>
  //         <PostList posts={mockPost} label="test-label" />
  //       </MemoryRouter>
  //     </RecoilRoot>
  //   );

  //   // 포스트 클릭
  //   fireEvent.click(screen.getByText('Post Title 1'));

  //   // updateViews 함수가 호출되었는지 확인
  //   expect(postUpdateFunctions.updateViews).toHaveBeenCalledWith('1');

  //   // Recoil 상태 업데이트 및 네비게이션 동작은 실제 구현에 따라 검증 방법이 달라질 수 있습니다.
  // });

  // afterEach(() => {
  //   jest.clearAllMocks();
  // });
});










// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { RecoilRoot } from 'recoil';
// import { MemoryRouter, Route, Routes } from 'react-router-dom';
// import PostList from './PostList';
// import { Post } from '../recoil';

// describe('PostList Component', () => {
//   const posts: Post[] = [
//     {
//       postUid: '1',
//       postId: 'postId1',
//       author: 'author1',
//       title: 'title1',
//       content: 'content1',
//       likes: ['user1', 'user2'], 
//       comments: [
//         {
//           commentUid: '1',
//           postId: 'postId1',
//           author: 'commentAuthor1',
//           comment: 'comment1',
//           likes: [],
//           createAt: new Date(),
//           commentId: 'commentId1'
//         },
//       ],
//       imageUrls: ['url1', 'url2'], 
//       createAt: new Date(),
//       postNumber:1,
//       views: 0,
//     },
//     {
//       postUid: '2',
//       postId: 'postId2',
//       author: 'author2',
//       title: 'title2',
//       content: 'content2',
//       likes: ['user3'], 
//       comments: [],
//       imageUrls: ['url3', 'url4'], 
//       createAt: new Date(),
//       postNumber:2,
//       views: 24,
//     },
//   ];
//       test('포스트 목록이 올바르게 렌더링되는지 확인합니다.', async () => {
//         render(
//           <RecoilRoot>
//             <MemoryRouter>
//               <PostList posts={posts} label="post-list" />
//             </MemoryRouter>
//           </RecoilRoot>
//         );
      
//         // 포스트 목록이 렌더링되었는지 확인합니다.
//         const postListElement = screen.getByTestId('post-list');
//         expect(postListElement).toBeInTheDocument();
      
//         // 각 포스트 아이템이 렌더링되었는지 확인합니다.
//         await waitFor(() => {
//           posts.forEach((post, index) => {
//             const postItem = screen.getByTestId(`post-item-${index}`);
//             const commentsCount = post.comments ? Object.keys(post.comments).length : 0;
//             const timeAgoText = screen.getByTestId(`post-date-${index}`).textContent;
//             const imageElement = screen.getByTestId(`post-image-${index}`);

//             expect(postItem).toBeInTheDocument();
//             expect(screen.getByText(post.title)).toBeInTheDocument();
//             expect(screen.getByText(post.author)).toBeInTheDocument();
//             expect(screen.getByTestId(`post-comments-${index}`)).toHaveTextContent(`댓글 ${commentsCount}`);
//             expect(screen.getByTestId(`post-views-${index}`)).toHaveTextContent(`조회수 ${post.views}`);
//             expect(timeAgoText).toContain('방금 전');
//             expect(imageElement).toBeInTheDocument();
//           });
//         });
//       });

//       test('포스트를 클릭하면 해당 포스트 상세 페이지로 이동합니다.', async () => {
//         render(
//           <RecoilRoot>
//             <MemoryRouter initialEntries={['/']}>
//               <Routes>
//                 <Route path="/" element={<PostList posts={posts} label="test" />} />
//                 <Route path="/:author/:postnumber" element={<div>포스트 상세 페이지</div>} />
//               </Routes>
//             </MemoryRouter>
//           </RecoilRoot>
//         );
    
//         // 포스트를 클릭합니다.
//         fireEvent.click(screen.getByText(posts[0].title));
    
//         // 포스트 상세 페이지로 이동되었는지 확인합니다.
//         await screen.findByText('포스트 상세 페이지');
//       });
// });
