import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import Navigation from './components/Navbar';
import CreateCommunityPage from "./pages/CreateCommunityPage";
const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-community" element={<CreateCommunityPage />}></Route>
      </Routes>
    </Router>
  )
}

export default App

