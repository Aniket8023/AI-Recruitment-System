import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Clock3,
  XCircle,
  ClipboardCheck,
  Video,
} from "lucide-react";

import applicationService from "../../services/applicationService";

const MyApplications = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await applicationService.getMyApplications();

      setApplications(data || []);

    } catch (err) {
      console.error("Failed to load applications:", err);

      setError(
        err?.response?.data?.message ||
        "Unable to load your applications."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case "MATCHED":
        return {
          label: "AI Matched",
          className: "application-status matched",
          icon: <CheckCircle2 size={15} />,
        };

      case "ASSESSMENT_PENDING":
        return {
          label: "Assessment Pending",
          className: "application-status assessment",
          icon: <ClipboardCheck size={15} />,
        };

      case "ASSESSMENT_COMPLETED":
        return {
          label: "Assessment Completed",
          className: "application-status completed",
          icon: <CheckCircle2 size={15} />,
        };

      case "INTERVIEW_PENDING":
        return {
          label: "Interview Pending",
          className: "application-status interview",
          icon: <Video size={15} />,
        };

      case "INTERVIEW_COMPLETED":
        return {
          label: "Interview Completed",
          className: "application-status completed",
          icon: <CheckCircle2 size={15} />,
        };

      case "SHORTLISTED":
        return {
          label: "Shortlisted",
          className: "application-status shortlisted",
          icon: <CheckCircle2 size={15} />,
        };

      case "REJECTED":
        return {
          label: "Rejected",
          className: "application-status rejected",
          icon: <XCircle size={15} />,
        };

      case "APPLIED":
      default:
        return {
          label: "Applied",
          className: "application-status applied",
          icon: <Clock3 size={15} />,
        };
    }
  };

  if (loading) {
    return (
      <div className="applications-page">

        <div className="page-header">
          <div>
            <h1>My Applications</h1>
            <p>
              Track the jobs you have applied for.
            </p>
          </div>
        </div>

        <div className="applications-loading">
          <div className="loader-spinner"></div>
          <p>Loading applications...</p>
        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="applications-page">

        <div className="page-header">
          <div>
            <h1>My Applications</h1>
            <p>
              Track the jobs you have applied for.
            </p>
          </div>
        </div>

        <div className="applications-error">
          <XCircle size={28} />

          <h3>Unable to load applications</h3>

          <p>{error}</p>

          <button
            onClick={loadApplications}
            className="retry-button"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="applications-page">

      {/* HEADER */}
      <div className="applications-header">

        <div>
          <div className="applications-eyebrow">
            APPLICATION TRACKER
          </div>

          <h1>My Applications</h1>

          <p>
            Track your applications and monitor your
            recruitment progress.
          </p>
        </div>

        <button
          className="refresh-applications"
          onClick={loadApplications}
        >
          <RefreshCw size={17} />
          Refresh
        </button>

      </div>


      {/* STATS */}
      <div className="application-summary">

        <div className="application-summary-card">
          <div className="summary-icon">
            <BriefcaseBusiness size={19} />
          </div>

          <div>
            <span>Total Applications</span>
            <strong>{applications.length}</strong>
          </div>
        </div>


        <div className="application-summary-card">
          <div className="summary-icon">
            <CheckCircle2 size={19} />
          </div>

          <div>
            <span>AI Matched</span>

            <strong>
              {
                applications.filter(
                  (item) =>
                    item.status === "MATCHED"
                ).length
              }
            </strong>
          </div>
        </div>


        <div className="application-summary-card">
          <div className="summary-icon">
            <ClipboardCheck size={19} />
          </div>

          <div>
            <span>Assessments</span>

            <strong>
              {
                applications.filter(
                  (item) =>
                    item.status ===
                      "ASSESSMENT_PENDING" ||
                    item.status ===
                      "ASSESSMENT_COMPLETED"
                ).length
              }
            </strong>
          </div>
        </div>


        <div className="application-summary-card">
          <div className="summary-icon">
            <Video size={19} />
          </div>

          <div>
            <span>Interviews</span>

            <strong>
              {
                applications.filter(
                  (item) =>
                    item.status ===
                      "INTERVIEW_PENDING" ||
                    item.status ===
                      "INTERVIEW_COMPLETED"
                ).length
              }
            </strong>
          </div>
        </div>

      </div>


      {/* APPLICATION LIST */}
      {applications.length === 0 ? (

        <div className="applications-empty">

          <div className="empty-icon">
            <BriefcaseBusiness size={32} />
          </div>

          <h2>No applications yet</h2>

          <p>
            Start exploring jobs and apply to positions
            that match your skills.
          </p>

          <button
            onClick={() =>
              navigate("/candidate/jobs")
            }
          >
            Find Jobs
            <ArrowRight size={17} />
          </button>

        </div>

      ) : (

        <div className="applications-list">

          {applications.map((application) => {

            const status =
              getStatusConfig(
                application.status
              );

            return (
              <div
                className="application-card"
                key={application.applicationId}
              >

                <div className="application-info-main">

                  <div className="application-company-icon">
                    <BriefcaseBusiness size={22} />
                  </div>

                  <div className="application-info">

                    <div className="application-title-row">

                      <h2>
                        {application.jobTitle}
                      </h2>

                      <span
                        className={status.className}
                      >
                        {status.icon}
                        {status.label}
                      </span>

                    </div>


                    <div className="application-meta">

                      <span>
                        <FileText size={15} />
                        Resume ID:{" "}
                        {application.resumeId}
                      </span>

                      <span>
                        <CalendarDays size={15} />
                        Application #
                        {application.applicationId}
                      </span>

                    </div>

                  </div>

                </div>


                <button
                  className="application-details-button"
                  onClick={() =>
                    navigate(
                      `/candidate/applications/${application.applicationId}`
                    )
                  }
                >
                  View Details
                  <ArrowRight size={17} />
                </button>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
};

export default MyApplications;