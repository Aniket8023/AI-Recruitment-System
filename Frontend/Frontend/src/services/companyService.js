import api from "./api";

/*
============================================================
GET MY COMPANY PROFILE
============================================================
*/
export const getMyCompany = async () => {
  const response = await api.get(
    "/companies/my"
  );

  return response.data;
};


/*
============================================================
CREATE COMPANY PROFILE
============================================================
*/
export const createCompany = async (companyData) => {
  const response = await api.post(
    "/companies",
    companyData
  );

  return response.data;
};


/*
============================================================
UPDATE MY COMPANY PROFILE
============================================================
*/
export const updateMyCompany = async (companyData) => {
  const response = await api.put(
    "/companies/my",
    companyData
  );

  return response.data;
};