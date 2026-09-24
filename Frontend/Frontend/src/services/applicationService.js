import api from "./api";

const applyForJob = async (jobId, resumeId) => {
  const response = await api.post(
    `/applications/jobs/${jobId}`,
    { resumeId }
  );

  return response.data;
};

const getMyApplications = async () => {
  const response = await api.get("/applications/my");
  return response.data;
};

const getApplication = async (applicationId) => {
  const response = await api.get(
    `/applications/${applicationId}`
  );

  return response.data;
};

export const getRecruiterApplications = async () => {

  const response = await api.get(
    "/applications/recruiter"
  );

  return response.data;
};

export default {
  applyForJob,
  getMyApplications,
  getApplication,
  getRecruiterApplications,
};