import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

const RecruiterLayout = () => {
  const location = useLocation();

  const getPageTitle = () => {
    if (
      location.pathname.includes(
        "/jobs/create"
      )
    ) {
      return "Create Job";
    }

    if (
      location.pathname.includes(
        "/jobs"
      )
    ) {
      return "My Jobs";
    }

    if (
      location.pathname.includes(
        "/candidates"
      )
    ) {
      return "Candidates";
    }

    if (
      location.pathname.includes(
        "/shortlisted"
      )
    ) {
      return "Shortlisted Candidates";
    }

    if (
      location.pathname.includes(
        "/profile"
      )
    ) {
      return "Company Profile";
    }

    if (
      location.pathname.includes(
        "/settings"
      )
    ) {
      return "Settings";
    }

    return "Recruiter Dashboard";
  };

  return (
    <div className="application-layout">

      <Sidebar role="RECRUITER" />

      <div className="application-main">

        <Topbar title={getPageTitle()} />

        <main className="page-container">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default RecruiterLayout;