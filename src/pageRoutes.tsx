import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PostCreatePage from "./pages/PostCreatePage";
import PostDetail from "./pages/PostDetail";
import PostPage from "./component/MainPost";
import UserPage from "./pages/UserPage";
import Profile from "./pages/Profile";

const PageRoutes = () => {
    return (
        <div>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignupPage/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/write" element={<PostCreatePage/>}/>
          <Route path="/write/:postid" element={<PostCreatePage/>}/>
          <Route path="/:author" element={<UserPage/>}/>
          <Route path="/:author/:postid" element={<PostDetail/>}/>
        </Routes>
        </div>
    );
};

export default PageRoutes;