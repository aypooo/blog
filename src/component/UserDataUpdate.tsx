import React, { Suspense, useEffect, useState } from 'react';
import { updateUserData } from '../firebase/auth';
import { userState } from '../recoil';
import { useRecoilState } from 'recoil';
import Button from './Button';
import uploadImages from '../hook/uploadImages';
import LoadingSpinner from './LoadingSpinner';

const UserDataUpdate = () => {
    const [user,setUser] = useRecoilState(userState);
    const [name, setName] = useState('')
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | undefined>(user.profile_picture);
    const [loading, setLoading] = useState(false)
    const handleUserData = async () => {
        try {

            const userRef = updateUserData(user.uid, user.email, name, imageUrl!); // 이미지 URL을 포함하여 사용자 정보 업데이트
            console.log('유저정보 저장', userRef);
            setUser({ uid: user.uid, email: user.email, name: name, profile_picture: imageUrl ?? undefined }); // 업데이트된 사용자 정보 설정
        } catch (error) {
            console.log(error);
        }
    };
    const handleProfileImage = async () => {
        let imageUrl = null;
        if (image) {
            // 이미지가 선택된 경우에만 이미지 업로드를 시도합니다.
            setLoading(true)
            const uploadedImageUrls = await uploadImages([image], user.uid, 'profile_image',100); // 이미지 업로드 함수 호출
            imageUrl = uploadedImageUrls[0]; // 업로드된 이미지의 URL을 가져옵니다.
            setImageUrl(imageUrl)
            setLoading(false)
        }

    }

    useEffect(()=>{
        if(user.name){
            setName(user.name)
        }
    },[user])

    useEffect(()=>{
        handleProfileImage()
        if(image===null){
            setImageUrl('')
        }
    },[image])

    return (
        <div className="user-data-update">
            <div className='layout'>
                <div className='user-data-update__form'>
                    <span className='user-data-update__title'>프로필 편집</span>
                    <div className="user-data-update__input__email">email: {user.email}</div>
                    <input className="user-data-update__input" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
                    {loading ? (
                        <>
                        <div className="user-data-update__input__profile-picture"></div>
                        <LoadingSpinner loading={loading}/>
                        </>
                    ):( 
                        <>
                        {imageUrl ?(
                          <img src={imageUrl} alt="프로필 사진" className="user-data-update__input__profile-picture" />  
                        ):(
                            <div className="user-data-update__input__profile-picture"></div>
                        )}
                        </>
                    )}
                    <input id="fileInput" className="user-data-update__input" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
    
                    <Button className="user-data-update__button" label='업데이트' size='s' onClick={handleUserData} />
                </div>
            </div>
        </div>
    );
};

export default UserDataUpdate;