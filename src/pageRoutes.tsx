import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PostCreatePage from "./pages/PostCreatePage";
import PostListPage from "./pages/PostListPage";

const PageRoutes = () => {
    return (
        <div>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignupPage/>}/>
          {/* <Route path="/mypage" element={<MyPage/>}/> */}
          <Route path="/write" element={<PostCreatePage/>}/>
          {/* <Route path="/write/modify/:id" element={<WritePage/>}/> */}
          <Route path="/post" element={<PostListPage/>}/>
          {/* <Route path="/post/:id" element={<PostListItem/>}/> */}
        </Routes>
        </div>
    );
};

export default PageRoutes;