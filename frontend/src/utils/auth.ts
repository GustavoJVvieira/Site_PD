// utils/auth.ts
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  // Aqui você pode validar o token (opcional), por exemplo verificar se expirou
  // Para simplificar, só verificamos se existe
  return true;
};
