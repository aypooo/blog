import React, { useState, useEffect } from 'react';
import { updateUserData } from '../firebase/auth';
import { userState } from '../recoil';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import ProfilePictureUpload from '../component/ProfilePictureUpload';
import ProfileUpdateForm from '../component/ProfileUpdateForm';
import Button from '../component/Button';

const ProfileUpdate: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userState);
    const [name, setName] = useState<string>("");
    const [currentName,setCurrentName] = useState(user.name)
    const [description, setDescription] = useState<string>("");

    const [imageUrl, setImageUrl] = useState<string | undefined>(user.profile_picture);
    const [isNameValidated, setIsNameValidated] = useState<boolean>(false);

    const handleUserData = async () => {
        try {
            if(isNameValidated){
                return alert('이름을 다시 확인해주세요.')
            }
            const updatedData = {
                name: name !== currentName ? name : currentName,
                profile_picture: imageUrl !== user.profile_picture && imageUrl !== undefined ? imageUrl : user.profile_picture,
                description: description !== user.description ? description : user.description
            };

            await updateUserData(user.uid, user.email, updatedData.name!, updatedData.profile_picture, updatedData.description);

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



    useEffect(() => {
        if (user.name) setName(user.name);
        if (user.description) setDescription(user.description);
    }, [user]);

    return (
        <div className="user-data-update">
            <div className='input-layout'>
                <ProfilePictureUpload
                    currentImageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    imageUrl={imageUrl}
                />
                <ProfileUpdateForm
                    email={user.email}
                    currentName={currentName}
                    name={name}
                    setName={setName}
                    description={description}
                    setDescription={setDescription}
                    setIsNameValidated={setIsNameValidated}
                />
                <Button className="user-data-update__button" label='업데이트' size='m' fullWidth={true} onClick={handleUserData} />
            </div>
        </div>
    );
};

export default ProfileUpdate;