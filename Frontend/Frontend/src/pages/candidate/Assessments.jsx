import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardCheck,
  Clock3,
  FileQuestion,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

import assessmentService from "../../services/assessmentService";

const Assessments = () => {
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssessments = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await assessmentService.getMyAssessments();

      setAssessments(data || []);

    } catch (err) {
      console.error(
        "Failed to load assessments:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load your assessments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const getStatus = (status) => {
    switch (status) {
      case "CREATED":
        return {
          label: "Ready to Start",
          className: "assessment-list-status ready",
          icon: <PlayCircle size={15} />,
        };

      case "IN_PROGRESS":
        return {
          label: "In Progress",
          className: "assessment-list-status progress",
          icon: <Clock3 size={15} />,
        };

      case "COMPLETED":
        return {
          label: "Completed",
          className: "assessment-list-status completed",
          icon: <CheckCircle2 size={15} />,
        };

      case "EVALUATED":
        return {
          label: "Evaluated",
          className: "assessment-list-status completed",
          icon: <CheckCircle2 size={15} />,
        };

      case "PASSED":
        return {
          label: "Passed",
          className: "assessment-list-status passed",
          icon: <CheckCircle2 size={15} />,
        };

      case "FAILED":
        return {
          label: "Failed",
          className: "assessment-list-status failed",
          icon: <AlertCircle size={15} />,
        };

      default:
        return {
          label: status || "Pending",
          className: "assessment-list-status",
          icon: <Clock3 size={15} />,
        };
    }
  };

  const handleAssessmentAction = (assessment) => {

    if (
      assessment.status === "COMPLETED" ||
      assessment.status === "EVALUATED" ||
      assessment.status === "PASSED" ||
      assessment.status === "FAILED"
    ) {
      navigate(
        `/candidate/assessment-result?assessmentId=${assessment.assessmentId}`
      );

      return;
    }

    navigate(
      `/candidate/assessment/${assessment.assessmentId}`
    );
  };

  if (loading) {
    return (
      <div className="assessments-page">

        <div className="assessments-page-header">
          <div>
            <span className="assessments-eyebrow">
              CANDIDATE ASSESSMENTS
            </span>

            <h1>My Assessments</h1>

            <p>
              Complete your assessments and continue
              your recruitment journey.
            </p>
          </div>
        </div>

        <div className="assessments-loading">
          <div className="loader-spinner"></div>
          <p>Loading assessments...</p>
        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="assessments-page">

        <div className="assessments-page-header">
          <div>
            <span className="assessments-eyebrow">
              CANDIDATE ASSESSMENTS
            </span>

            <h1>My Assessments</h1>

            <p>
              Complete your assessments and continue
              your recruitment journey.
            </p>
          </div>
        </div>

        <div className="assessments-error">

          <AlertCircle size={32} />

          <h2>Unable to load assessments</h2>

          <p>{error}</p>

          <button onClick={loadAssessments}>
            <RotateCcw size={16} />
            Try Again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="assessments-page">

      {/* HEADER */}
      <div className="assessments-page-header">

        <div>
          <span className="assessments-eyebrow">
            CANDIDATE ASSESSMENTS
          </span>

          <h1>My Assessments</h1>

          <p>
            Complete your assessments and continue
            your recruitment journey.
          </p>
        </div>

        <button
          className="assessments-refresh"
          onClick={loadAssessments}
        >
          <RotateCcw size={16} />
          Refresh
        </button>

      </div>


      {/* SUMMARY */}
      <div className="assessments-summary">

        <div className="assessments-summary-card">
          <div className="assessments-summary-icon">
            <ClipboardCheck size={20} />
          </div>

          <div>
            <span>Total</span>
            <strong>{assessments.length}</strong>
          </div>
        </div>

        <div className="assessments-summary-card">
          <div className="assessments-summary-icon">
            <PlayCircle size={20} />
          </div>

          <div>
            <span>Pending</span>
            <strong>
              {
                assessments.filter(
                  (item) =>
                    item.status === "CREATED" ||
                    item.status === "IN_PROGRESS"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="assessments-summary-card">
          <div className="assessments-summary-icon">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Completed</span>
            <strong>
              {
                assessments.filter(
                  (item) =>
                    item.status === "COMPLETED" ||
                    item.status === "EVALUATED" ||
                    item.status === "PASSED" ||
                    item.status === "FAILED"
                ).length
              }
            </strong>
          </div>
        </div>

      </div>


      {/* LIST */}
      {assessments.length === 0 ? (

        <div className="assessments-empty">

          <div className="assessments-empty-icon">
            <FileQuestion size={34} />
          </div>

          <h2>No assessments available</h2>

          <p>
            Assessments will appear here once you are
            selected for the next recruitment stage.
          </p>

          <button
            onClick={() =>
              navigate("/candidate/applications")
            }
          >
            View Applications
            <ArrowRight size={17} />
          </button>

        </div>

      ) : (

        <div className="assessments-list">

          {assessments.map((assessment) => {

            const status =
              getStatus(assessment.status);

            return (
              <div
                className="assessment-list-card"
                key={assessment.assessmentId}
              >

                <div className="assessment-list-main">

                  <div className="assessment-list-icon">
                    <ClipboardCheck size={25} />
                  </div>

                  <div className="assessment-list-content">

                    <div className="assessment-list-title-row">

                      <h2>
                        {assessment.jobTitle ||
                          "Job Assessment"}
                      </h2>

                      <span
                        className={status.className}
                      >
                        {status.icon}
                        {status.label}
                      </span>

                    </div>

                    <p className="assessment-list-subtitle">
                      AI-powered recruitment assessment
                    </p>

                    <div className="assessment-list-meta">

                      <span>
                        <FileQuestion size={15} />
                        {assessment.totalQuestions} Questions
                      </span>

                      <span>
                        <Clock3 size={15} />
                        {assessment.durationMinutes} Minutes
                      </span>

                      <span>
                        Assessment #
                        {assessment.assessmentId}
                      </span>

                    </div>

                  </div>

                </div>


                <button
                  className="assessment-list-action"
                  onClick={() =>
                    handleAssessmentAction(
                      assessment
                    )
                  }
                >
                  {assessment.status === "CREATED"
                    ? "Start Assessment"
                    : assessment.status === "IN_PROGRESS"
                    ? "Continue"
                    : "View Result"}

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

export default Assessments;