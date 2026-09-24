import api from "./api";

/*
============================================================
MATCH JOB WITH RESUME
============================================================
*/

const matchJobWithResume = async (
  jobId,
  resumeId
) => {
  const response = await api.post(
    `/matching/jobs/${jobId}/resumes/${resumeId}`
  );

  return response.data;
};

const getRecommendedJobs = async (candidateId) => {
  const response = await api.get(
    `/matching/candidates/${candidateId}/recommendations`
  );

  return response.data;
};


/*
============================================================
GET CANDIDATES FOR A JOB
============================================================
Used mainly by recruiter side.
============================================================
*/

const getCandidates = async (
  jobId,
  status = null
) => {
  const url = status
    ? `/matching/jobs/${jobId}/candidates?status=${status}`
    : `/matching/jobs/${jobId}/candidates`;

  const response = await api.get(url);

  return response.data;
};


/*
============================================================
GET CANDIDATE DETAILS
============================================================
*/

const getCandidateDetails = async (
  jobId,
  resumeId
) => {
  const response = await api.get(
    `/matching/jobs/${jobId}/candidates/${resumeId}`
  );

  return response.data;
};


/*
============================================================
GET CANDIDATE EVALUATION
============================================================
*/

const getCandidateEvaluation = async (
  jobId,
  candidateId,
  resumeId
) => {
  const response = await api.get(
    `/matching/jobs/${jobId}/candidates/${candidateId}/resumes/${resumeId}/evaluation`
  );

  return response.data;
};


/*
============================================================
SHORTLIST CANDIDATE
============================================================
*/

export const shortlistCandidate = async (jobId, resumeId) => {
  const response = await api.patch(
    `/matching/jobs/${jobId}/candidates/${resumeId}/shortlist`
  );

  return response.data;
};

export const rejectCandidate = async (jobId, resumeId) => {
  const response = await api.patch(
    `/matching/jobs/${jobId}/candidates/${resumeId}/reject`
  );

  return response.data;
};

/*
============================================================
GET RECRUITER DASHBOARD
============================================================
*/

const getRecruiterDashboard = async (
  jobId
) => {
  const response = await api.get(
    `/matching/jobs/${jobId}/dashboard`
  );

  return response.data;
};


export default {
  matchJobWithResume,
  getCandidates,
  getCandidateDetails,
  getCandidateEvaluation,
  shortlistCandidate,
  rejectCandidate,
  getRecruiterDashboard,
  getRecommendedJobs,
};