import api from "./api";

const login = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

const register = async (userData) => {
  const response = await api.post("/auth/register", userData);

  return response.data;
};

const authService = {
  login,
  register,
};

export default authService;