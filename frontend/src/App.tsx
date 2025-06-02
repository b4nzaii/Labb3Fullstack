import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from './pages/HomePage';
import Navigation from './components/Navbar';
import CreateCommunityPage from "./pages/CreateCommunityPage";
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import CreatePostPage from "./pages/CreatePostPage";
import CommunityPage from "./pages/CommunityPage";
import ProfilePage from "./pages/ProfilePage";
import PostPage from "./pages/PostPage";
import LandingPage from "./pages/LandingPage";
import UserProfilePage from './pages/UserProfilePage';
const AppWrapper = () => {

  const location = useLocation();

  const isLoggedIn = localStorage.getItem("token");

  useEffect(() => {
    const darkMode = localStorage.getItem("dark_mode") === "true";
    document.body.classList.toggle("dark-mode", darkMode);
  }, []);

  return (
    <>
      {/* Dölj navigation om vi är på landningssidan och INTE inloggad */}
      {!(location.pathname === "/" && !isLoggedIn) && <Navigation />}

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <HomePage /> : <LandingPage />
          }
        />
        <Route path="/create-community" element={<CreateCommunityPage />} />
        <Route path="/c/:name" element={<CommunityPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/posts/:id" element={<PostPage />} />
        <Route path="/users/:username" element={<UserProfilePage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;

