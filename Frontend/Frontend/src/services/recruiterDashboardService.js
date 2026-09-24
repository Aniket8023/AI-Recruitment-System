import api from "./api";

export const getRecruiterDashboard = async () => {

  const response = await api.get(
    "/recruiter/dashboard"
  );

  return response.data;
};