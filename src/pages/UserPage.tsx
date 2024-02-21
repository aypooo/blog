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

  const handleToggleSubscribe = async () => {
    if (!authorData[0]) {
      return; 
    }
  
    const authorUid = authorData[0].uid;
  
    // user.uid를 follower에서 제거 또는 추가
    const updatedFollowers = isSubscribed
      ? Object.fromEntries(
          Object.entries(authorData[0].follower || {}).filter(([key]) => key !== user.uid)
        )
      : { ...authorData[0].follower, [user.uid]: true };
  
    // 팔로워 수를 업데이트하고, user.uid를 follower에서 추가 또는 제거한 객체를 저장
    setAuthorData((prevData) => {
      const updatedData = { ...prevData[0], follower: updatedFollowers };
      return [updatedData] as User[];
    });
  
    // 구독 또는 구독 취소 로직
    if (isSubscribed) {
      unsubscribeUser(user.uid, authorUid);
      console.log('구독 취소됨');
    } else {
      subscribeUser(user.uid, authorUid);
      console.log('구독됨');
    }
  
    // 구독 상태 업데이트
    setIsSubscribed(!isSubscribed);
  };

  useEffect(()=>{
    window.scroll(0,0)
  },[])

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

  useEffect(() => {
    // 현재 사용자가 작성자에게 이미 구독 중인지 확인
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
        </div>
      </Suspense>
    </div>
  );
};

export default UserPage;