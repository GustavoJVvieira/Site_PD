import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Users from "./pages/Users";
import BlogArea from "./pages/BlogArea";
import AuthMiddleware from "./middleware/middleware";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={
          <AuthMiddleware>
            <Users/>
        </AuthMiddleware>
        } />
        <Route path="/blog" element={
          <AuthMiddleware>
            <BlogArea/>
        </AuthMiddleware>} />
      </Routes>
    </Router>
  );
}

export default App;
