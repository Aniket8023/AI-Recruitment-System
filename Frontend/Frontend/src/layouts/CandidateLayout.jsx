import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";


const CandidateLayout = () => {
  const location = useLocation();

  const isAssessmentPage =
  location.pathname.includes(
    "/candidate/assessment"
  );

  const getPageTitle = () => {

    // =========================
    // JOBS
    // =========================

    if (location.pathname.includes("/jobs")) {
      return "Find Jobs";
    }


    // =========================
    // APPLICATIONS
    // =========================

    if (
      location.pathname.includes("/applications")
    ) {
      return "My Applications";
    }


    // =========================
    // ASSESSMENT RESULT
    // =========================

    if (
      location.pathname.includes(
        "/assessment-result"
      )
    ) {
      return "Assessment Result";
    }


    // =========================
    // ACTUAL ASSESSMENT
    // =========================

    if (
      location.pathname.includes(
        "/assessment/"
      )
    ) {
      return "Assessment";
    }

    if (
      location.pathname ===
      "/candidate/assessment"
    ) {
      return "Assessment";
    }


    // =========================
    // ASSESSMENT LIST
    // =========================

    if (
      location.pathname.includes(
        "/assessments"
      )
    ) {
      return "Assessments";
    }


    // =========================
    // INTERVIEWS
    // =========================

    if (
      location.pathname.includes(
        "/interviews"
      )
    ) {
      return "Interviews";
    }
    

 


    // =========================
    // PROFILE
    // =========================

    if (
      location.pathname.includes(
        "/profile"
      )
    ) {
      return "My Profile";
    }


    // =========================
    // SETTINGS
    // =========================

    if (
      location.pathname.includes(
        "/settings"
      )
    ) {
      return "Settings";
    }


    // =========================
    // DEFAULT
    // =========================

    return "Dashboard";
  };

  return (
    <div className="application-layout">

      <Sidebar role="CANDIDATE" />

      <div className="application-main">

        <Topbar
          title={getPageTitle()}
        />

        <main className="page-container">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default CandidateLayout;