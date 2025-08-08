import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="flex justify-start items-center p-4 bg-[#121212] border-b border-purple-800">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/planos-de-curso")}
          className="bg-purple-800 text-white px-4 py-2 rounded-lg transition hover:border hover:border-white"
        >
          Planos de Curso
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 text-white px-4 py-2 rounded-lg transition hover:bg-red-700"
        >
          Sair
        </button>
      </div>
    </header>
  );
}