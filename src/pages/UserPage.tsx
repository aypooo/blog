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
  // const [bookmarkData, setBookmarkData] = useState<Post[]>([]);
  const [authorData, setAuthorData] = useState<User[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [toggleContent, setToggleContent] = useState(false);
  const [loadingAuthorPost, setLoadingAuthorPost] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(false);
  const [loadingAuthorData, setLoadingAuthorData] = useState(false);

  // console.log('user.bookmark:',user.bookmark)
  // console.log('userPosts:',userPosts)
  console.log('bookmarkData:',bookmarkData)
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
      setLoadingAuthorPost(true);
      setLoadingBookmark(true);
      setLoadingAuthorData(true);

      await fetchAuthorData(setAuthorData, author!);
      if(authorData){
      setLoadingAuthorData(false);
      
      await fetchAuthorPostData(setUserPosts, author!);
      if(userPosts){
        setLoadingAuthorPost(false);
      }
      await fetchBookmarkData(setBookmarkData, user.bookmark!);
      if(bookmarkData){
      setLoadingBookmark(false);
      }
      
      }
    };
    fetchData();
  }, [author, setBookmarkData, setUserPosts,setAuthorData]);

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
            
              <Suspense fallback={<LoadingSpinner loading={loadingBookmark}/>} >
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
            </Suspense>
  
                <div className="user-page__buttons">
                <Button
                  fullWidth={true}
                  onClick={() => setToggleContent(false)}
                  size="l"
                  label="게시물"
                />
                <Button
                  fullWidth={true}
                  onClick={() => setToggleContent(true)}
                  size="l"
                  label="북마크"
                />
              </div>
            
              {toggleContent ? (
                <>
                  {loadingBookmark ? (
                    <LoadingSpinner loading={loadingBookmark} />
                  ) : (
                    <UserPost label='bookmark' userPosts={bookmarkData} />
                  )}
                </>
              ) : (
                <>
                  {loadingAuthorPost ? (
                    <LoadingSpinner loading={loadingAuthorPost} />
                  ) : (
                    <UserPost label='userpost' userPosts={userPosts} />
                  )}
                </>
              )}
                   </div>
        ) : (
          <div className="layout">
          {loadingAuthorData ? (
              <LoadingSpinner loading={loadingBookmark} />
            ):(
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
            )}
            <UserPost label='userpost' userPosts={userPosts} />
          </div>
        )}
      </div>

  );
};

export default UserPage;