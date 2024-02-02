import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Logout from '../component/Logout';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Post, User, userPostsState, userState } from '../recoil';
import Button from '../component/Button';
import Dropdown from '../component/DropDown';
import { subscribeUser, unsubscribeUser } from '../firebase/subscription';
import { readAuthorData } from '../firebase/auth';
import { readBookmarkPostData } from '../firebase/bookmark';
import UserPost from '../component/UserPost';
import { fetchAuthorPostData } from '../hook/fetchData';

const UserPage: React.FC = () => {
  // const isLoggedIn = useRecoilValue(isLoggedInState);
  const user = useRecoilValue(userState);
  const [userPosts, setUserPosts] = useRecoilState(userPostsState);
  const [authorData, setAuthorData] = useState<User[]>([]);
  const [bookmarkData, setBookmarkData] = useState<Post[]>([]);
  const { author } = useParams();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [toggleContent, setToggleContent] = useState(false);
  
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
    const fetchAuthorData = async () => {
      try {
        const authorData = await readAuthorData(author!);
        setAuthorData(Object.values(authorData as unknown as User[]))
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    };
    const fetchBookmarkData = async () => {
      console.log('userbookmark',user)
      try {
        if (user.bookmark) {
          const bookmarkData = await readBookmarkPostData(Object.keys(user.bookmark));
          console.log('bookmark',bookmarkData)
          setBookmarkData(bookmarkData);
        }
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    };
    fetchAuthorPostData(setUserPosts,author!)
    fetchBookmarkData()
    fetchAuthorData();
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
        {user.name === author ? (
          <div className="layout">
          <div className="user-page__profile">
            <div className="user-page__profile__info">
              <span>{authorData[0]?.name}</span>
              <Dropdown label="⋮">
                <span>
                  <Link to="/profile">
                    프로필 수정
                  </Link>
                </span>
                <Logout/>
              </Dropdown>
            </div>
            <div className="user-page__profile__follow">
              <span>팔로워 {authorData[0]?.follower ? Object.keys(authorData[0].follower).length : 0}</span>
              <span>팔로잉 {authorData[0]?.follow ? Object.keys(authorData[0].follow).length : 0}</span>
            </div>
          </div>
                <div className="user-page__buttons">
                <Button
                  onClick={() => setToggleContent(false)}
                  size="s"
                  label="게시물"
                />
                <Button
                  onClick={() => setToggleContent(true)}
                  size="s"
                  label="북마크"
                />
              </div>
              <UserPost userPosts={userPosts} />
                 {/* {toggleContent ? (
                  <UserPost userPosts={bookmarkData} />
                ) : (
                  <UserPost userPosts={userPosts} />
                )} */}
                   </div>
        ) : (
          <div className="layout">
          <div className="user-page__profile">
            <div className="user-page__profile__info">
              <span>{authorData[0]?.name}</span>
              <Button
                onClick={handleToggleSubscribe}
                size='s'
                label={isSubscribed ? '구독중' : '구독'}
              />
            </div>
            <div className="user-page__profile__follow">
              <span>팔로워 {authorData[0]?.follower ? Object.keys(authorData[0].follower).length : 0}</span>
              <span>팔로잉 {authorData[0]?.follow ? Object.keys(authorData[0].follow).length : 0}</span>
            </div>
          </div>
          <UserPost userPosts={userPosts} />
          </div>
        )}
      </div>

  );
};

export default UserPage;