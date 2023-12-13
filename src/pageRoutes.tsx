import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PostCreatePage from "./pages/PostCreatePage";
import PostListPage from "./pages/PostListPage";
import PostDetail from "./component/PostDetail";
import MyPage from "./pages/MyPage";

const PageRoutes = () => {
    return (
        <div>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignupPage/>}/>
          <Route path="/mypage" element={<MyPage/>}/>
          <Route path="/write" element={<PostCreatePage/>}/>
          <Route path="/write/:postid" element={<PostCreatePage/>}/>
          <Route path="/userpost" element={<PostListPage/>}/>
          {/* <Route path="/:id" element={<PostListPage/>}/> */}
          <Route path="/userpost/:postid" element={<PostDetail/>}/>
          {/* <Route path="/:id/:postid" element={<PostDetail/>}/> */}
        </Routes>
        </div>
    );
};

export default PageRoutes;