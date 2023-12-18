import React, { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { commentkeys, userState } from '../recoil';
import { writeNewComment } from '../firebase/comment';


const Comment = ({postId,postUid}:{postId:string, postUid:string}) => {
    const user = useRecoilValue(userState);
    const setCommentkeys = useSetRecoilState<any>(commentkeys);
    const [comment, setComment] = useState('');
    const handleWriteComment = async() => {
        try{
           const commentKey =  writeNewComment(postId, postUid, user.uid, user.name, comment)
           console.log(commentKey)
           setCommentkeys(commentKey)
            alert('댓글이 작성되었습니다.')
        }catch(error){
            console.log('댓글 작성 실패', error)
        }

    }
    return (
        <div>
            <input type="text" onChange={(e)=> setComment(e.target.value)}/>
            <button onClick={handleWriteComment}>작성하기</button>
        </div>
    );
};

export default Comment