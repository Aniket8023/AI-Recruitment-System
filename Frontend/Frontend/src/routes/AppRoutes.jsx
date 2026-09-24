import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "../components/common/ProtectedRoute";

import CandidateLayout from "../layouts/CandidateLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";

import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";

import Jobs from "../pages/candidate/Jobs";

import JobDetails from "../pages/candidate/JobDetails";
import CandidateProfile from "../pages/candidate/Profile";

import MyApplications from "../pages/candidate/MyApplications";

import ApplicationDetails from "../pages/candidate/ApplicationDetails";
import Assessment from "../pages/candidate/Assessment";

import Assessments from "../pages/candidate/Assessments";
import AssessmentResult from "../pages/candidate/AssessmentResult";
import Interviews from "../pages/candidate/Interviews";
import Interview from "../pages/candidate/Interview";
import InterviewResult from "../pages/candidate/InterviewResult";



import RecruiterJobs from "../pages/recruiter/RecruiterJobs";
import RecruiterCreateJob from "../pages/recruiter/RecruiterCreateJob";
import RecruiterJobDetails from "../pages/recruiter/RecruiterJobDetails";
import RecruiterEditJob from "../pages/recruiter/RecruiterEditJob";
import RecruiterCandidates from "../pages/recruiter/RecruiterCandidates";
import RecruiterCandidateDetails
  from "../pages/recruiter/RecruiterCandidateDetails";

import ShortlistedCandidates from "../pages/recruiter/ShortlistedCandidates";
import RecruiterProfile from "../pages/recruiter/Profile";
import Settings from "../pages/recruiter/Settings";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= AUTH ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================= CANDIDATE ================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["CANDIDATE"]}
            />
          }
        >
                    <Route 
            path="/candidate" 
            element={<CandidateLayout />} 
          >
            
            <Route 
              index 
              element={
                <Navigate 
                  to="/candidate/dashboard" 
                  replace 
                />
              } 
            />

            <Route 
              path="dashboard" 
              element={<CandidateDashboard />} 
            />

            <Route 
              path="jobs" 
              element={<Jobs />} 
            />

            <Route 
              path="jobs/:jobId" 
              element={<JobDetails />} 
            />

            <Route
  path="profile"
  element={<CandidateProfile />}
/>

            <Route 
              path="applications" 
              element={<MyApplications />} 
            />

            <Route 
              path="applications/:applicationId" 
              element={<ApplicationDetails />} 
            />

            {/* ASSESSMENT */}
            <Route 
              path="assessment/:assessmentId" 
              element={<Assessment />} 
            />

            <Route 
              path="assessment" 
              element={<Assessment />} 
            />

                          <Route
                path="assessments"
                element={<Assessments />}
              />

                      <Route
          path="assessment-result"
          element={<AssessmentResult />}
        />

                <Route
          path="interviews"
          element={<Interviews />}
        />

       <Route path="interview" element={<Interview />} />
<Route
  path="interview-result"
  element={<InterviewResult />}
/>

          </Route>
        </Route>

        {/* ================= RECRUITER ================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "RECRUITER",
                "COMPANY_ADMIN",
              ]}
            />
          }
        >
          <Route
            path="/recruiter"
            element={<RecruiterLayout />}
          >

            <Route
              index
              element={
                <Navigate
                  to="/recruiter/dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={
                <RecruiterDashboard />
              }
            />

                      <Route
              path="jobs"
              element={<RecruiterJobs />}
            />

            <Route
              path="jobs/create"
              element={<RecruiterCreateJob />}
            />

            <Route
              path="jobs/:jobId"
              element={<RecruiterJobDetails />}
            />

                  <Route
          path="jobs/:jobId/edit"
          element={<RecruiterEditJob />}
        />

     <Route
  path="candidates"
  element={<RecruiterCandidates />}
/>

<Route
  path="candidates/:applicationId"
  element={<RecruiterCandidateDetails />}
/>

<Route 
  path="shortlisted" 
  element={<ShortlistedCandidates />} 
/>

<Route
  path="profile"
  element={<RecruiterProfile />}
/>

<Route path="settings" element={<Settings />} />

          </Route>
        </Route>

        {/* ================= DEFAULT ================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;