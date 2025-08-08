import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cursos from "./pages/Cursos";
import PrivateRoute from "./pages/PrivateRoute";

function App() {
  return (
    <Router>  {/* Envolvendo as rotas no Router */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/planos-de-curso" element={<Cursos />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
