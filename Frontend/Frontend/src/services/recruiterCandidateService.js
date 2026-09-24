import api from "./api";

export const getRecruiterCandidates = async () => {
  const response = await api.get(
    "/applications/recruiter/candidates"
  );

  return response.data;
};

export const getRecruiterCandidateDetails = async (
  applicationId
) => {
  const response = await api.get(
    `/applications/recruiter/candidates/${applicationId}`
  );

  return response.data;
};