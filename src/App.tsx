import './App.css';
import Gbn from './component/Gbn';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import { RecoilRoot } from 'recoil';
import PageRoutes from './pageRoutes';
function App() {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user)
    });
  }, []);
  return (
    <div className="App">
      <RecoilRoot>
        <Gbn/>
        <PageRoutes/>
      </RecoilRoot>
    </div>
  );
}

export default App;
