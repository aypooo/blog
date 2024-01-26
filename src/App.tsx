import './App.css';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import { useSetRecoilState } from 'recoil';
import PageRoutes from './pageRoutes';
import { isLoggedInState, userState } from './recoil';
import { readUserData } from './firebase/auth';
import Gnb from './component/Gnb';
import Modal from './component/Modal';

function App() {
  const setUser = useSetRecoilState(userState);
  const setisLoggedIn = useSetRecoilState(isLoggedInState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
    if (user) {
        const userData = await readUserData(user.uid!)
        console.log(userData)
        setUser({ uid: userData!.uid, email: userData!.email!, name: userData!.name });
        setisLoggedIn(true);
      } else {
        setUser({ uid: '', email: '', name: '' });
        setisLoggedIn(false);
      }
    });

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리
    return () => unsubscribe();
  }, [setUser, setisLoggedIn]);

  return (
    <div className="App">
      <Gnb />
      <PageRoutes />
      <Modal/>
    </div>
  );
}

export default App;