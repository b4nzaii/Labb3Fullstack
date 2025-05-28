import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import Navigation from './components/Navbar';
import CreateCommunityPage from "./pages/CreateCommunityPage";
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import CreatePostPage from "./pages/CreatePostPage";
import CommunityPage from "./pages/CommunityPage";
import ProfilePage from "./pages/ProfilePage";
const App = () => {

  // Kontrollera om dark mode är aktiverat
  useEffect(() => {
    const darkMode = localStorage.getItem("dark_mode") === "true";
    document.body.classList.toggle("dark-mode", darkMode);
  })
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-community" element={<CreateCommunityPage />}></Route>
        <Route path="/c/:name" element={<CommunityPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  )
}

export default App

