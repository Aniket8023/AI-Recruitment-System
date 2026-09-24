import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  FileText,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Video,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

import applicationService from "../../services/applicationService";

const ApplicationDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await applicationService.getApplication(
        applicationId
      );

      setApplication(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load application details."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return "Applied";

    return status
      .replaceAll("_", " ")
      .replaceAll("-", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStageStatus = (stage, applicationStatus) => {
  const status = applicationStatus?.toUpperCase();

  if (status === "REJECTED") {
    return "rejected";
  }

  const stageOrder = {
    APPLIED: 1,
    MATCHED: 2,
    ASSESSMENT_PENDING: 3,
    ASSESSMENT_COMPLETED: 4,
    INTERVIEW_PENDING: 5,
    INTERVIEW_COMPLETED: 6,
    SHORTLISTED: 7,
  };

  const currentStage = stageOrder[status] || 1;
  const targetStage = stageOrder[stage];

  if (currentStage > targetStage) {
    return "completed";
  }

  if (currentStage === targetStage) {
    return "current";
  }

  return "pending";
};

  if (loading) {
    return (
      <div className="application-details-loading">
        <div className="applications-spinner"></div>
        <p>Loading application...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="application-details-page">
        <button
          className="application-back-button"
          onClick={() => navigate("/candidate/applications")}
        >
          <ArrowLeft size={17} />
          Back to Applications
        </button>

        <div className="application-details-error">
          <AlertCircle size={38} />

          <h2>Application not found</h2>

          <p>
            {error || "We could not find this application."}
          </p>

          <button
            className="application-primary-button"
            onClick={() =>
              navigate("/candidate/applications")
            }
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const status = application.status?.toUpperCase();

const getNextStep = () => {
  switch (status) {

    case "APPLIED":
      return {
        type: "WAITING",
        title: "Application under review",
        description:
          "Your application has been submitted and is waiting for AI matching.",
      };

    case "MATCHED":
    case "ASSESSMENT_PENDING":
      return {
        type: "ASSESSMENT",
        title: "Complete your assessment",
        description:
          "Your profile has been matched with this job. Complete the assessment to continue.",
      };

    case "ASSESSMENT_COMPLETED":
    case "INTERVIEW_PENDING":
      return {
        type: "INTERVIEW",
        title: "Complete your interview",
        description:
          "You have completed the assessment. The next stage is the AI interview.",
      };

    case "INTERVIEW_COMPLETED":
      return {
        type: "INTERVIEW_RESULT",
        title: "Interview completed",
        description:
          "Your interview has been completed. View your interview result.",
      };

    case "SHORTLISTED":
      return {
        type: "SHORTLISTED",
        title: "You have been shortlisted",
        description:
          "Congratulations! You have successfully completed the recruitment stages.",
      };

    case "REJECTED":
      return {
        type: "REJECTED",
        title: "Application closed",
        description:
          "This application is no longer active.",
      };

    default:
      return {
        type: "WAITING",
        title: "Application submitted",
        description:
          "Your application has been submitted successfully.",
      };
  }
};

const nextStep = getNextStep();

  return (
    <div className="application-details-page">

      {/* Back */}
      <button
        className="application-back-button"
        onClick={() =>
          navigate("/candidate/applications")
        }
      >
        <ArrowLeft size={17} />
        Back to Applications
      </button>

      {/* Header */}
      <section className="application-details-header">

        <div className="application-details-icon">
          <BriefcaseBusiness size={30} />
        </div>

        <div className="application-details-title">
          <span className="application-details-eyebrow">
            APPLICATION DETAILS
          </span>

          <h1>{application.jobTitle}</h1>

          <div className="application-details-meta">
            <span>
              <FileText size={15} />
              Resume ID: {application.resumeId}
            </span>

            <span>
              Application #{application.applicationId}
            </span>
          </div>
        </div>

        <div className="application-current-status">
          <span>Current Status</span>

          <strong>
            {getStatusLabel(application.status)}
          </strong>
        </div>

      </section>

      {/* Progress */}
      <section className="application-progress-card">

        <div className="application-section-heading">
          <div>
            <h2>Application Progress</h2>
            <p>Track your recruitment journey</p>
          </div>
        </div>

       <div className="application-progress">

  {/* APPLIED */}
  <div
    className={`progress-step ${getStageStatus(
      "APPLIED",
      application.status
    )}`}
  >
    <div className="progress-step-icon">
      <CheckCircle2 size={20} />
    </div>

    <strong>Applied</strong>
    <span>Application submitted</span>
  </div>

  <div
    className={`progress-line ${
      getStageStatus("MATCHED", application.status) ===
        "completed" ||
      getStageStatus("MATCHED", application.status) ===
        "current"
        ? "completed-line"
        : ""
    }`}
  />

  {/* AI MATCHED */}
  <div
    className={`progress-step ${getStageStatus(
      "MATCHED",
      application.status
    )}`}
  >
    <div className="progress-step-icon">
      <Sparkles size={20} />
    </div>

    <strong>AI Matched</strong>
    <span>Profile matched with job</span>
  </div>

  <div
    className={`progress-line ${
      getStageStatus(
        "ASSESSMENT_PENDING",
        application.status
      ) === "completed" ||
      getStageStatus(
        "ASSESSMENT_PENDING",
        application.status
      ) === "current"
        ? "completed-line"
        : ""
    }`}
  />

  {/* ASSESSMENT */}
  <div
    className={`progress-step ${
      application.status === "ASSESSMENT_COMPLETED" ||
      application.status === "INTERVIEW_PENDING" ||
      application.status === "INTERVIEW_COMPLETED" ||
      application.status === "SHORTLISTED"
        ? "completed"
        : application.status === "ASSESSMENT_PENDING"
        ? "current"
        : "pending"
    }`}
  >
    <div className="progress-step-icon">
      <ClipboardCheck size={20} />
    </div>

    <strong>Assessment</strong>

    <span>
      {application.status === "ASSESSMENT_PENDING"
        ? "Action required"
        : application.status === "ASSESSMENT_COMPLETED"
        ? "Assessment completed"
        : "Next stage"}
    </span>
  </div>

  <div
    className={`progress-line ${
      application.status === "INTERVIEW_COMPLETED" ||
      application.status === "SHORTLISTED"
        ? "completed-line"
        : ""
    }`}
  />

  {/* INTERVIEW */}
  <div
    className={`progress-step ${
      application.status === "INTERVIEW_COMPLETED" ||
      application.status === "SHORTLISTED"
        ? "completed"
        : application.status === "INTERVIEW_PENDING"
        ? "current"
        : "pending"
    }`}
  >
    <div className="progress-step-icon">
      <Video size={20} />
    </div>

    <strong>Interview</strong>

    <span>
      {application.status === "INTERVIEW_PENDING"
        ? "Action required"
        : application.status === "INTERVIEW_COMPLETED"
        ? "Interview completed"
        : application.status === "SHORTLISTED"
        ? "Completed"
        : "Final stage"}
    </span>
  </div>

</div>

{application.status === "REJECTED" && (
  <div className="application-rejected-banner">
    <AlertCircle size={18} />

    <div>
      <strong>Application not selected</strong>

      <p>
        This application has been closed. You can continue
        exploring other opportunities.
      </p>
    </div>
  </div>
)}
      </section>

      {/* Information */}
      <div className="application-details-grid">

        <section className="application-info-card">

          <div className="application-section-heading">
            <div>
              <h2>Application Information</h2>
              <p>Details submitted with your application</p>
            </div>
          </div>

          <div className="application-info-grid">

            <div className="application-info-item">
              <span>Job Position</span>
              <strong>{application.jobTitle}</strong>
            </div>

            <div className="application-info-item">
              <span>Application ID</span>
              <strong>#{application.applicationId}</strong>
            </div>

            <div className="application-info-item">
              <span>Resume Used</span>
              <strong>Resume ID: {application.resumeId}</strong>
            </div>

            <div className="application-info-item">
              <span>Application Status</span>
              <strong>
                {getStatusLabel(application.status)}
              </strong>
            </div>

          </div>
        </section>

        {/* Next step */}
        <section className="application-next-card">

  <div className="application-next-icon">
    {nextStep.type === "INTERVIEW" ? (
      <Video size={25} />
    ) : nextStep.type === "REJECTED" ? (
      <AlertCircle size={25} />
    ) : nextStep.type === "SHORTLISTED" ? (
      <CheckCircle2 size={25} />
    ) : (
      <ClipboardCheck size={25} />
    )}
  </div>

  <span>YOUR NEXT STEP</span>

  <h2>
    {nextStep.title}
  </h2>

  <p>
    {nextStep.description}
  </p>

  {/* ASSESSMENT */}
  {nextStep.type === "ASSESSMENT" && (
    <button
      className="application-primary-button"
      onClick={() =>
        navigate(
          `/candidate/assessment?jobId=${application.jobId}&resumeId=${application.resumeId}`
        )
      }
    >
      Go to Assessment
      <ArrowRight size={16} />
    </button>
  )}

  {/* INTERVIEW */}
  {nextStep.type === "INTERVIEW" && (
    <button
      className="application-primary-button"
      onClick={() =>
        navigate(
          `/candidate/interview?jobId=${application.jobId}&candidateId=${application.candidateId || ""}&resumeId=${application.resumeId}`
        )
      }
    >
      Start Interview
      <ArrowRight size={16} />
    </button>
  )}

  {/* INTERVIEW RESULT */}
  {nextStep.type === "INTERVIEW_RESULT" && (
    <button
      className="application-primary-button"
      onClick={() =>
        navigate(
          `/candidate/interview-result?candidateId=${application.candidateId || ""}&jobId=${application.jobId}`
        )
      }
    >
      View Interview Result
      <ArrowRight size={16} />
    </button>
  )}

  {/* SHORTLISTED */}
  {nextStep.type === "SHORTLISTED" && (
    <button
      className="application-primary-button"
      onClick={() =>
        navigate("/candidate/applications")
      }
    >
      View Applications
      <ArrowRight size={16} />
    </button>
  )}

</section>

      </div>

    </div>
  );
};

export default ApplicationDetails;