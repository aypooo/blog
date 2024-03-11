import React from 'react';
import Button from './Button';
import { User } from '../recoil';
import Dropdown from './DropDown';
import { Link } from 'react-router-dom';
import Logout from './Logout';

interface UserProfileProps {
  authorData: User;
  isOwnProfile: boolean;
  toggleSubscribe: () => void;
  isSubscribed: boolean;

}

const UserPageProfile : React.FC<UserProfileProps> = ({ authorData,isOwnProfile, toggleSubscribe, isSubscribed }) => {
  return (
    <div className='user-page__profile'>
      <div className='user-page__profile__content'>
        <div className='user-page__profile__thumb'
          style={{ backgroundImage: `url(${authorData?.profile_picture || '../../../images/profile_image.png' })`}}
        />
        <div className="user-page__profile__info">
          <span className="user-page__profile__info__author">{authorData?.name}</span>
          <div className="user-page__profile__info__follower">
            <span>팔로워 {authorData?.follower ? Object.keys(authorData.follower).length : 0}</span>
            <span>팔로잉 {authorData?.follow ? Object.keys(authorData.follow).length : 0}</span>
          </div>
          <div className="user-page__profile__info__description">{authorData?.description}</div>
        </div>
      </div>
      {isOwnProfile ? (
        <div className='user-page__profile__edit'>
          <Dropdown label="⋮">  
            <Button onClick={()=>{<Link to="/profileupdate"/>}} label='프로필 수정'/>
            <Logout/>
          </Dropdown>
        </div>
        ):(
        <Button
          onClick={toggleSubscribe}
          size='s'
          label={isSubscribed ? '구독중' : '구독'}
        />
      )}
    </div>
  );
};

export default UserPageProfile;