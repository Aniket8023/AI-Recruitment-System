import api from "./api";

/*
============================================================
GET MY RESUMES
============================================================
*/
const getMyResumes = async (candidateId) => {
  const response = await api.get(
    `/resumes/candidate/${candidateId}`
  );

  return response.data;
};


/*
============================================================
GET RESUME FILE
============================================================
Fetches the actual PDF/DOCX file
============================================================
*/
const getResumeFile = async (resumeId) => {
  const response = await api.get(
    `/resumes/${resumeId}/file`,
    {
      responseType: "blob",
    }
  );

  return response;
};


/*
============================================================
GET RESUME FILE URL
============================================================
*/
const getResumeFileUrl = (resumeId) => {
  return `${api.defaults.baseURL}/resumes/${resumeId}/file`;
};


/*
============================================================
UPLOAD RESUME
============================================================
*/
const uploadResume = async (candidateId, file) => {
  const formData = new FormData();

  formData.append("candidateId", candidateId);
  formData.append("file", file);

  const response = await api.post(
    "/resumes/upload",
    formData
  );

  return response.data;
};


export default {
  getMyResumes,
  uploadResume,
  getResumeFile,
  getResumeFileUrl,
};