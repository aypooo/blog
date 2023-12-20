import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PostCreatePage from "./pages/PostCreatePage";
import PostListPage from "./component/PostList";
import PostDetail from "./pages/PostDetail";
import MyPage from "./pages/MyPage";
import UserPostPage from "./pages/UserPostPage";
import PostPage from "./pages/PostPage";
import UserPage from "./pages/UserPage";

const PageRoutes = () => {
    return (
        <div>
        <Routes>
          <Route path="/" element={<PostPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignupPage/>}/>
          <Route path="/mypage" element={<MyPage/>}/>
          <Route path="/write" element={<PostCreatePage/>}/>
          <Route path="/write/:postid" element={<PostCreatePage/>}/>
          <Route path="/:user" element={<UserPage/>}/>
          <Route path="/:user/:postid" element={<PostDetail/>}/>
        </Routes>
        </div>
    );
};

export default PageRoutes;