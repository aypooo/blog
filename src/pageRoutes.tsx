import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PostCreatePage from "./pages/PostCreatePage";
import PostDetail from "./pages/PostDetail";
import UserPage from "./pages/UserPage";
import ProfileUpdate from "./pages/ProfileUpdate";

const PageRoutes = () => {
    return (
        <div>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignupPage/>}/>
          <Route path="/profileupdate" element={<ProfileUpdate/>}/>
          <Route path="/write" element={<PostCreatePage/>}/>
          <Route path="/write/:postnumer" element={<PostCreatePage/>}/>
          <Route path="/:author" element={<UserPage/>}/>
          <Route path="/:author/:postnumer" element={<PostDetail/>}/>
        </Routes>
        </div>
    );
};

export default PageRoutes;