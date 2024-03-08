import React, { useEffect, useState } from 'react';
import Button from './Button';
import { validateName } from '../hook/validation';
import { useModal } from '../hook/useModal';

interface ProfileUpdateFormProps {
  email:string;
  name: string;
  currentName:string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setIsNameValidated: React.Dispatch<React.SetStateAction<boolean>>
}

const ProfileUpdateForm: React.FC<ProfileUpdateFormProps> = ({email,currentName, name, setName, description, setDescription,setIsNameValidated }) => {
const [nameError, setNameError] = useState<string | null>(null);
const { openModal, closeModal } = useModal();
  
const validateNameAsync = async () => {
  if(currentName !== name){
    const error = await validateName(name);
    setNameError(error);
    if(error){
      setIsNameValidated(true)
    }else{
      openModal({
        content: '사용 할 수 있는 이름입니다.',
        hasCancelButton:false,
        callback: () => {
          closeModal()
        },
      })
      setIsNameValidated(false)
    }

  }
};
    return (
        <div className="user-data-update__form">
            <label className="user-data-update__label">이메일</label>
            <div className="user-data-update__email">
                {email}
            </div>
            <label className="user-data-update__label">작가명</label>
            <div className="user-data-update__ahthor">
                <input className="user-data-update__input" placeholder="작가명" value={name} onChange={(e) => setName(e.target.value)} />
                <Button onClick={validateNameAsync} size='s' fullWidth={false} label={'중복확인'}></Button>
            </div>
            {nameError ? <p className="error">{nameError}</p> : null}

            <label className="user-data-update__label">소개글</label>
            <textarea className="user-data-update__description" maxLength={30} placeholder="소개글을 작성해주세요." value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
    );
};

export default ProfileUpdateForm;