import React, { Suspense, useEffect, useState } from 'react';
import { updateUserData } from '../firebase/auth';
import { userState } from '../recoil';
import { useRecoilState } from 'recoil';
import Button from './Button';
import uploadImages from '../hook/uploadImages';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { validateName } from '../hook/validation';
interface UpdatedData {
    name?: string;
    profile_picture?: string;
    description?: string;
}
const UserDataUpdate = () => {
    const navigate = useNavigate()
    const [user,setUser] = useRecoilState(userState);
    const [name, setName] = useState('')
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | undefined>(user.profile_picture);
    const [loading, setLoading] = useState(false)
    const [description, setDescription] = useState('')
    const [nameError, setNameError] = useState<string | null>('');
    const handleUserData = async () => {
        try {
            // 현재 상태와 이전 상태를 비교하여 변경된 필드만 업데이트할 객체를 생성합니다.
            const updatedData:UpdatedData = {};
            updatedData.name = name !== user.name ? name : user.name ;
            updatedData.profile_picture = imageUrl !== user.profile_picture && imageUrl !== undefined? (imageUrl) : (user.profile_picture)
            updatedData.description = description !== user.description ? description : user.description;
            // console.log(updatedData)
            console.log('imageUrl',imageUrl)
            console.log('user.profile_picture',user.profile_picture)
            console.log('updatedData.profile_picture',updatedData.profile_picture)
            // 사용자 데이터 업데이트 함수를 호출하기 전에 변경 사항이 있는지 확인합니다.
            const userRef = await updateUserData(user.uid, user.email, updatedData.name!, updatedData.profile_picture, updatedData.description);
            console.log('유저정보 저장', userRef);
    
            // Recoil 상태를 업데이트할 때, 변경된 필드만 업데이트합니다.
            setUser(prevUser => ({
                ...prevUser,
                ...updatedData
            }));
    
            alert('업데이트 되었습니다.');
            navigate(`/${user.name}`);
        } catch (error) {
            console.log(error);
        }
    };
    const handleProfileImage = async () => {
        let imageUrl = null;
        if (image) {
            // 이미지가 선택된 경우에만 이미지 업로드를 시도합니다.
            setLoading(true)
            const uploadedImageUrls = await uploadImages([image], 'profileImage',100); // 이미지 업로드 함수 호출
            imageUrl = uploadedImageUrls[0]; // 업로드된 이미지의 URL을 가져옵니다.
            setImageUrl(imageUrl)
            setLoading(false)
        }

    }
    const validateNameAsync = async () => {
        const error = await validateName(name);
        setNameError(error);
      };
    useEffect(()=>{
        if(user.description){
            setDescription(user.description)
        }
    },[user])
    useEffect(()=>{
        if(user.name){
            setName(user.name)
        }
    },[user])

    useEffect(()=>{
        handleProfileImage()
        if(image===null){
            setImageUrl(undefined)
        }
    },[image])
    
// console.log('profile_picture',user.profile_picture)
// console.log('description',user.description)
// console.log('name',user.name)
// console.log('user',user)

// console.log('imageUrl',imageUrl)
    return (
        <div className="user-data-update">
            <div className='input-layout'>
                <div className='user-data-update__form'>
                    <span className='user-data-update__title'>프로필 편집</span>
                    
                    <div className="user-data-update__profile-picture">
                        {loading ? (
                            <div className="user-data-update__profile-picture__wrapper">
                                <LoadingSpinner loading={loading}/>
                                <img src={ user.profile_picture ? (user.profile_picture) : ('../../../images/profile_image.png')}   alt="프로필 사진" className="user-data-update__profile-picture__thumb" /> 
                                <label className="user-data-update__profile-picture__input-file" htmlFor="file-input"/>
                                <input id="file-input" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                            </div>
                        ):( 
                            <div className="user-data-update__profile-picture__wrapper">
                                <img src={ imageUrl ? imageUrl : (user.profile_picture ? (user.profile_picture) : ('../../../images/profile_image.png'))}   alt="프로필 사진" className="user-data-update__profile-picture__thumb" /> 
                                <label className="user-data-update__profile-picture__input-file" htmlFor="file-input"/>
                                <input id="file-input" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                                {imageUrl ? <Button className='user-data-update__profile-picture__button' onClick={()=>setImageUrl('')} label='X'></Button>: null}
                            </div>
                        )}
                      
                    </div>
                    <label className="user-data-update__label">이메일</label>
                    <div className="user-data-update__email"> 
                        {user.email}
                    </div>
                    <label className="user-data-update__label">작가명</label>
                    <div className="user-data-update__ahthor">
                        <input className="user-data-update__input" placeholder="작가명" value={name} onChange={(e) => setName(e.target.value)} />
                        <Button onClick={validateNameAsync} size='s' fullWidth={false} label={'중복확인'}></Button>
                    </div>
                    {nameError ? <p className="error">{nameError}</p>:<p className="error"></p> }
                    <label className="user-data-update__label">소개글</label>
                    <textarea className="user-data-update__description" maxLength={30} placeholder="소개글을 작성해주세요." value={description} onChange={(e) => setDescription(e.target.value)} />
                        
                    <Button className="user-data-update__button" label='업데이트' size='m' fullWidth={true} onClick={handleUserData} />
                </div>
            </div>
        </div>
    );
};

export default UserDataUpdate;