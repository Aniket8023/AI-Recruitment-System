import api from "./api";

const getMyInterviews = async (candidateId) => {
  const response = await api.get(
    `/interview/candidates/${candidateId}/interviews`
  );

  return response.data;
};

const generateQuestions = async (
  jobId,
  candidateId,
  resumeId
) => {
  const response = await api.post(
    `/interview/jobs/${jobId}/candidates/${candidateId}/resumes/${resumeId}/questions`
  );

  return response.data;
};

const getQuestions = async (
  candidateId,
  jobId,
  resumeId
) => {
  const response = await api.get(
    `/interview/candidates/${candidateId}/jobs/${jobId}/resumes/${resumeId}/questions`
  );

  return response.data;
};

const submitAnswer = async (
  candidateId,
  questionId,
  answer
) => {
  const response = await api.post(
    `/interview/candidates/${candidateId}/questions/${questionId}/answer`,
    {
      answer,
    }
  );

  return response.data;
};

const submitVoiceAnswer = async (
  candidateId,
  questionId,
  audioBlob
) => {

  const formData =
    new FormData();

  formData.append(
    "audio",
    audioBlob,
    "voice-answer.webm"
  );

  const response =
    await api.post(
      `/interview/candidates/${candidateId}/questions/${questionId}/voice-answer`,
      formData
    );

  return response.data;
};

const terminateInterview = async (
  candidateId,
  jobId,
  violationCount,
  reason
) => {
  const response = await api.post(
    `/interview/candidates/${candidateId}/jobs/${jobId}/terminate`,
    {
      violationCount,
      reason,
    }
  );

  return response.data;
};

const getInterviewResult = async (
  candidateId,
  jobId
) => {
  const response = await api.get(
    `/interview/candidates/${candidateId}/jobs/${jobId}/result`
  );

  return response.data;
};
export default {
  generateQuestions,
  getQuestions,
  submitAnswer,
  submitVoiceAnswer,
  getInterviewResult,
  getMyInterviews,
  terminateInterview,
};