import api from "./api";

const getMyProfile = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

const updateMyProfile = async (profileData) => {
  const response = await api.put("/users/me", profileData);
  return response.data;
};

const changePassword = async (passwordData) => {
  const response = await api.patch(
    "/users/me/password",
    passwordData
  );
  return response.data;
};

export default {
  getMyProfile,
  updateMyProfile,
  changePassword,
};