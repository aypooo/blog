import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Logout from '../component/Logout';
import { useRecoilValue } from 'recoil';
import { User, isLoggedInState, userState } from '../recoil';
import Button from '../component/Button';
import UserPostPage from '../component/UserPostPage';
import Dropdown from '../component/DropDown';
import { subscribeUser, unsubscribeUser } from '../firebase/subscription';
import { readAuthorData } from '../firebase/auth';
import { useToggleSubscribeUser } from '../hook/useToggleSubscribeUser';

const UserPage: React.FC = () => {
  // const isLoggedIn = useRecoilValue(isLoggedInState);
  const user = useRecoilValue(userState);
  const [authorData, setAuthorData] = useState<User[]>([]);
  const { author } = useParams();
  // const toggleSubscribeUser = useToggleSubscribeUser();

  const handleSubscribe = async()=>{
    if (authorData) {
      subscribeUser(user.uid,authorData[0].uid);
      // toggleSubscribeUser(authorData[0].uid);
      console.log('구독됨');
      // setAuthorData((prevAuthorData) => [
      //   {
      //     ...prevAuthorData[0],
      //     follower: { ...(prevAuthorData[0]?.follower || {}), [user.uid]: true },
      //   },
      // ]);
    } 
  }
  const handleUnSubscribe = async()=>{
    if (authorData) {
      unsubscribeUser(user.uid,authorData[0].uid);
      console.log('구독취소됨');
    } 
  }
  useEffect(()=>{
    window.scroll(0,0)
  },[])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorData = await readAuthorData(author!);
        setAuthorData(Object.values(authorData as unknown as User[]))
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    };

    fetchData();
  }, [author]); // 이 훅은 author가 변경될 때마다 다시 실행됩니다.
  console.log(authorData[0])
  return (
    <div className="user-page">
      <div className="layout">
        {user.name === author ? (
          <div className="user-page__profile">
            <div className="user-page__profile__info">
              <span>{authorData[0]?.name}</span>
              <span>팔로워 {authorData[0]?.follower ? Object.keys(authorData[0].follower).length : 0}</span>
              <span>팔로잉 {authorData[0]?.follow ? Object.keys(authorData[0].follow).length : 0}</span>
              {/* <span>팔로워 {authorData[0]?.follower ? Object.keys(authorData[0].follower).length : 0}</span>
              <span>팔로잉 {authorData[0]?.follow ? Object.keys(authorData[0].follow).length : 0}</span> */}
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
        ) : (
          <div className="user-page__profile">
            <div className="user-page__profile__info">
              <span>{authorData[0]?.name}</span>
              <span>팔로워 {authorData[0]?.follower ? Object.keys(authorData[0].follower).length : 0}</span>
              <span>팔로잉 {authorData[0]?.follow ? Object.keys(authorData[0].follow).length : 0}</span>
              <Button onClick={handleSubscribe} label='구독'></Button>
              <Button onClick={handleUnSubscribe} label='구독취소'></Button>
            </div>
          </div>
        )}
        <UserPostPage />
      </div>
    </div>
  );
};

export default UserPage;