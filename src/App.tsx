import './App.css';
import Gbn from './component/Gbn';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import { useSetRecoilState } from 'recoil';
import PageRoutes from './pageRoutes';
import { isLoggedInState, userState } from './recoil';

function App() {
  const setUser = useSetRecoilState(userState);
  const setisLoggedIn = useSetRecoilState(isLoggedInState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ uid: user.uid, email: user.email! });
        setisLoggedIn(true);
      } else {
        setUser({ uid: '', email: '' });
        setisLoggedIn(false);
      }
    });

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리
    return () => unsubscribe();
  }, [setUser, setisLoggedIn]);

  return (
    <div className="App">
      <Gbn />
      <PageRoutes />
    </div>
  );
}

export default App;