import React, { Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { User, userBookmarkState, userPostsState, userState } from '../recoil';
import Button from '../component/Button';
import { subscribeUser, unsubscribeUser } from '../firebase/subscription';
import UserPost from '../component/UserPost';
import { fetchAuthorData, fetchAuthorPostData, fetchBookmarkData } from '../hook/fetchData';
import LoadingSpinner from '../component/LoadingSpinner';
import UserPageProfile from '../component/UserPageProfile';


const UserPage: React.FC = () => {
  const { author } = useParams();
  const user = useRecoilValue(userState);
  const [userPosts, setUserPosts] = useRecoilState(userPostsState);
  const [bookmarkData, setBookmarkData] = useRecoilState(userBookmarkState);
  const [authorData, setAuthorData] = useState<User[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [toggleContent, setToggleContent] = useState(false);
  const [loading, setLoading] = useState(false);
  // 구독 토글 핸들러
  const handleToggleSubscribe = async () => {
    if (!authorData[0]) {
      return; 
    }
    const authorUid = authorData[0].uid;
  
    // 구독 여부에 따라 팔로워 목록 업데이트
    const updatedFollowers = isSubscribed
      ? // 이미 구독 중인 경우, 사용자 UID를 제외하고 팔로워 목록 업데이트
        Object.fromEntries(
          Object.entries(authorData[0].follower || {}).filter(([key]) => key !== user.uid)
        )
      : // 구독하지 않은 경우, 사용자 UID를 추가하여 팔로워 목록 업데이트
        { ...authorData[0].follower, [user.uid]: true };
  
    // 작가 데이터 업데이트
    setAuthorData((prevData) => {
      const updatedData = { ...prevData[0], follower: updatedFollowers };
      return [updatedData] as User[];
    });
  
    // 구독 상태에 따라 Firebase에 구독 또는 구독 취소 요청
    if (isSubscribed) {
      // 이미 구독 중인 경우, 구독 취소 요청
      unsubscribeUser(user.uid, authorUid);
      console.log('구독 취소됨');
    } else {
      // 구독하지 않은 경우, 구독 요청
      subscribeUser(user.uid, authorUid);
      console.log('구독됨');
    }
  
    // 구독 상태를 토글
    setIsSubscribed(!isSubscribed);
  };

  // 페이지 이동시 화면 맨 위로 스크롤
  useEffect(()=>{
    window.scroll(0,0)
  },[]);

  // 작가 데이터 및 작가의 글, 사용자의 북마크 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      await fetchAuthorData(setAuthorData, author!);
      await fetchAuthorPostData(setUserPosts, author!);
      await fetchBookmarkData(setBookmarkData, user.bookmark!);

      setLoading(false);
    };
    fetchData();
  }, [author]);

  // 작가를 구독 중인지 확인
  useEffect(() => {
    if (authorData[0]?.follower) {
      setIsSubscribed(
        Object.keys(authorData[0]?.follower).includes(user.uid)
      );
    }
  }, [authorData, user.uid]);

  return (
    <div className="user-page">
      <Suspense fallback={<LoadingSpinner loading={loading}/>}>
        <div className="layout">
          <UserPageProfile authorData={authorData[0]} isOwnProfile={user.name === author} toggleSubscribe={handleToggleSubscribe} isSubscribed={isSubscribed} />
          {user.name === author ? (
            <>
          <div className="user-page__tabs">
            <Button
              fullWidth={true}
              onClick={() => setToggleContent(false)}
              size="xl"
              label="글"
              className={!toggleContent ? 'selected' : ''}
            />
            <Button
              fullWidth={true}
              onClick={() => setToggleContent(true)}
              size="xl"
              label="담은 글"
              className={!toggleContent ? '' : 'selected'}
            />
          </div>
          {toggleContent ? (
              <UserPost label='bookmark' userPosts={bookmarkData} />
            ) : (
              <UserPost label='userpost' userPosts={userPosts} />
            )}
            </>
          ): (
            <>
            <UserPost label='userpost' userPosts={userPosts} />
            </>
          )}
         
        </div>
      </Suspense>
    </div>
  );
};

export default UserPage;