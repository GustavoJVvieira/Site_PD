// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cursos from "./pages/Cursos";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública de login */}
        <Route path="/" element={<Login />} />

        {/* Rotas que você quer que sejam públicas (sem login) */}
        <Route path="/home" element={<Dashboard />} />
        <Route path="/planos-de-curso" element={<Cursos />} />

        {/* Exemplo de como seria uma rota privada, se você tivesse uma */}
        {/* <Route element={<PrivateRoute />}>
          <Route path="/perfil" element={<Perfil />} />
        </Route> */}
      </Routes>
    </Router>
  );
}

export default App;