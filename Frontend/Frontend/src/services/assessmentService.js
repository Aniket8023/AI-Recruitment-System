import api from "./api";

const createAssessment = async (jobId, resumeId) => {
  const response = await api.post(
    `/assessments/jobs/${jobId}/resumes/${resumeId}`
  );

  return response.data;
};

const generateQuestions = async (assessmentId) => {
  const response = await api.post(
    `/assessments/${assessmentId}/generate-questions`
  );

  return response.data;
};

const getQuestions = async (assessmentId) => {
  const response = await api.get(
    `/assessments/${assessmentId}/questions`
  );

  return response.data;
};

const submitAssessment = async (assessmentId, answers) => {
  const response = await api.post(
    `/assessments/${assessmentId}/submit`,
    {
      answers,
    }
  );

  return response.data;
};

const checkInterviewEligibility = async (assessmentId) => {
  const response = await api.get(
    `/assessments/${assessmentId}/interview-eligibility`
  );

  return response.data;
};

const getMyAssessments = async () => {
  const response = await api.get("/assessments/my");
  return response.data;
};

const getAssessmentResult = async (assessmentId) => {
  const response = await api.get(
    `/assessments/${assessmentId}/result`
  );

  return response.data;
};

export default {
  createAssessment,
  generateQuestions,
  getQuestions,
  submitAssessment,
  checkInterviewEligibility,
  getMyAssessments,
  getAssessmentResult,
};