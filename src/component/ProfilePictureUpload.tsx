import React, { useState } from 'react';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import uploadImages from '../hook/uploadImages';

interface ProfilePictureUploadProps {
  currentImageUrl: string | undefined;
    imageUrl:string | undefined
  setImageUrl: (url: string | undefined) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ currentImageUrl,imageUrl, setImageUrl }) => {
  const [loading, setLoading] = useState(false);
  
  const handleProfileImage = async (image: File | null) => {
    let imageUrl = null;
    if (image) {
      setLoading(true);
      const uploadedImageUrls = await uploadImages([image], 'profileImage', 100);
      imageUrl = uploadedImageUrls[0];
      setImageUrl(imageUrl);
      setLoading(false);
    }
  };
  return (
    <div className="user-data-update__profile-picture">
      {loading ? (
        <div className="user-data-update__profile-picture__wrapper">
          <LoadingSpinner loading={loading}/>
          <img src={currentImageUrl || '../../../images/profile_image.png'} alt="프로필 사진" className="user-data-update__profile-picture__thumb" />
          <label className="user-data-update__profile-picture__input-file" htmlFor="file-input"/>
          <input id="file-input" type="file" accept="image/*" onChange={(e) => handleProfileImage(e.target.files?.[0] || null)} />
        </div>
      ) : (
        <div className="user-data-update__profile-picture__wrapper">
          <img src={ imageUrl ? imageUrl : (currentImageUrl ? (currentImageUrl) : ('../../../images/profile_image.png'))}   alt="프로필 사진" className="user-data-update__profile-picture__thumb" /> 
          <label className="user-data-update__profile-picture__input-file" htmlFor="file-input"/>
          <input id="file-input" type="file" accept="image/*" onChange={(e) => handleProfileImage(e.target.files?.[0] || null)} />
          {currentImageUrl ? <Button className='user-data-update__profile-picture__button' onClick={() => setImageUrl(undefined)} label='X'></Button> : null}
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;