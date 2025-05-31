import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Usa o proxy
  headers: {
    "Content-Type": "application/json",
  },
});

// Adiciona o token automaticamente se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na requisição:", {
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
      response: error.response ? error.response.data : null,
      status: error.response ? error.response.status : null,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default api;
