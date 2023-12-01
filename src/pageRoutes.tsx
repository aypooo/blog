import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const PageRoutes = () => {
    return (
        <div>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignupPage/>}/>
          {/* <Route path="/mypage" element={<MyPage/>}/> */}
          {/* <Route path="/write" element={<WritePage/>}/> */}
          {/* <Route path="/write/modify/:id" element={<WritePage/>}/> */}
          {/* <Route path="/post" element={<PostPage/>}/> */}
          {/* <Route path="/post/:id" element={<PostListItem/>}/> */}
        </Routes>
        </div>
    );
};

export default PageRoutes;