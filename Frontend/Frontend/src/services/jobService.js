import api from "./api";

const getPublishedJobs = async () => {
  const response = await api.get("/jobs/published");
  return response.data;
};

const getPublicJob = async (jobId) => {
  const response = await api.get(`/jobs/public/${jobId}`);
  return response.data;
};

export default {
  getPublishedJobs,
  getPublicJob,
};