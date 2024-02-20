import React, { Suspense, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Logout from '../component/Logout';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Post, User, userBookmarkState, userPostsState, userState } from '../recoil';
import Button from '../component/Button';
import Dropdown from '../component/DropDown';
import { subscribeUser, unsubscribeUser } from '../firebase/subscription';
import UserPost from '../component/UserPost';
import { fetchAuthorData, fetchAuthorPostData, fetchBookmarkData } from '../hook/fetchData';
import LoadingSpinner from '../component/LoadingSpinner';

const UserPage: React.FC = () => {
  const { author } = useParams();
  const user = useRecoilValue(userState);
  const [userPosts, setUserPosts] = useRecoilState(userPostsState);
  const [bookmarkData, setBookmarkData] = useRecoilState(userBookmarkState);
  const [authorData, setAuthorData] = useState<User[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [toggleContent, setToggleContent] = useState(false);
  const [loading, setLoading] = useState(false);

  // console.log('user.bookmark:',user.bookmark)
  // console.log('userPosts:',userPosts)
  // console.log('bookmarkData:',bookmarkData)
  // console.log('authorData:',authorData)
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
          <Suspense fallback={<LoadingSpinner loading={loading}/>} >
        {user.name === author ? (
          <div className="layout">
        
              <div className="user-page__profile">
                  <div className='user-page__profile'>
                      <div className='user-page__profile__thumb'
                      style={{ backgroundImage: `url(${authorData[0]?.profile_picture || '../../../images/profile_image.png' })`}}
                      />
                      <div className="user-page__profile__info">
                        <span className="user-page__profile__info__author">{authorData[0]?.name}</span>
                        <div className="user-page__profile__info__follower">
                          <span>팔로워 {authorData[0]?.follower ? Object.keys(authorData[0].follower).length : 0}</span>
                          <span>팔로잉 {authorData[0]?.follow ? Object.keys(authorData[0].follow).length : 0}</span>
                        </div>
                        <div className="user-page__profile__info__description"> {authorData[0]?.description}</div>
                    </div>
                  </div>
                  <div className='user-page__profile__edit'>
                    <Dropdown label="⋮">
                      <span>
                        <Link to="/profile">
                          프로필 수정
                        </Link>
                      </span>
                      <Logout/>
                    </Dropdown>
                  </div>
              </div>
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
                <>
                    <UserPost label='bookmark' userPosts={bookmarkData} />
                </>
              ) : (
                <>
                    <UserPost label='userpost' userPosts={userPosts} />
                </>
              )}
            </div>
        ) : (
          <div className="layout">
              {/* <Logout/> */}
              <div className='user-page__profile'>
            <div className='user-page__profile'>
              <div className='user-page__profile__thumb'
              style={{ backgroundImage: `url(${authorData[0]?.profile_picture || '../../../images/profile_image.png' })`}}
              />
              <div className="user-page__profile__info">
                <span className="user-page__profile__info__author">{authorData[0]?.name}</span>
                <div className="user-page__profile__info__follower">
                  <span>팔로워 {authorData[0]?.follower ? Object.keys(authorData[0].follower).length : 0}</span>
                  <span>팔로잉 {authorData[0]?.follow ? Object.keys(authorData[0].follow).length : 0}</span>
                </div>
                <div className="user-page__profile__info__description"> {authorData[0]?.description}</div>
   
            </div>
            </div>
            <Button
                  onClick={handleToggleSubscribe}
                  size='s'
                  label={isSubscribed ? '구독중' : '구독'}
                />
            </div>
    
  
            <UserPost label='userpost' userPosts={userPosts} />
          </div>
        )}
        </Suspense>
      </div>

  );
};

export default UserPage;