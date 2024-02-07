import React, { useEffect, useState } from 'react';
import { writeUserData } from '../firebase/auth';
import { userState } from '../recoil';
import { useRecoilState } from 'recoil';
import Button from './Button';

const UserDataUpdate = () => {
    const [user,setUser] = useRecoilState(userState);
    const [name, setName] = useState('')

    const handleUserData =  async() => {
        try{
            const userRef = writeUserData(user.uid, user.email,name)
            console.log('유저정보 저장', userRef)
            setUser({uid:user.uid, email:user.email, name:name})
        }catch(error){
            console.log(error)
        }
    }
    useEffect(()=>{
        if(user.name){
            setName(user.name)
        }
    },[user])
    return (
        <div>
            <div>email: {user.email}</div>
            <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
            <Button label='업데이트' size='s' onClick={handleUserData}/>
        </div>
    );
};

export default UserDataUpdate;