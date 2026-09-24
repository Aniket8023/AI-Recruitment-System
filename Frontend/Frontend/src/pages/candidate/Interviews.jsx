import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Clock3,
  FileQuestion,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  RotateCcw,
  AlertCircle,
  Trophy,
} from "lucide-react";

import interviewService from "../../services/interviewService";
import { useAuth } from "../../context/AuthContext";

const Interviews = () => {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInterviews = async () => {

    try {

      setLoading(true);
      setError("");

      if (!user?.userId) {
        setError("Candidate information not found.");
        return;
      }

      const data =
        await interviewService.getMyInterviews(
          user.userId
        );

      setInterviews(data || []);

    } catch (err) {

      console.error(
        "Failed to load interviews:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load your interviews."
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadInterviews();
  }, [user?.userId]);


  const getStatus = (status) => {

    switch (status) {

      case "READY":
        return {
          label: "Ready to Start",
          className: "interview-list-status ready",
          icon: <PlayCircle size={15} />,
        };

      case "IN_PROGRESS":
        return {
          label: "In Progress",
          className: "interview-list-status progress",
          icon: <Clock3 size={15} />,
        };

      case "COMPLETED":
        return {
          label: "Completed",
          className: "interview-list-status completed",
          icon: <CheckCircle2 size={15} />,
        };

      default:
        return {
          label: "Interview",
          className: "interview-list-status",
          icon: <Video size={15} />,
        };
    }
  };


  const handleInterview = (interview) => {

    if (interview.status === "COMPLETED") {

      navigate(
        `/candidate/interview-result?candidateId=${interview.candidateId}&jobId=${interview.jobId}`
      );

      return;
    }

    navigate(
      `/candidate/interview?jobId=${interview.jobId}&candidateId=${interview.candidateId}&resumeId=${interview.resumeId}`
    );
  };


  if (loading) {

    return (
      <div className="interviews-page">

        <div className="interviews-page-header">

          <div>
            <span className="interviews-eyebrow">
              AI INTERVIEWS
            </span>

            <h1>My Interviews</h1>

            <p>
              Continue your AI-powered interview
              journey.
            </p>
          </div>

        </div>

        <div className="interviews-loading">

          <div className="loader-spinner"></div>

          <p>
            Loading interviews...
          </p>

        </div>

      </div>
    );
  }


  if (error) {

    return (
      <div className="interviews-page">

        <div className="interviews-page-header">

          <div>
            <span className="interviews-eyebrow">
              AI INTERVIEWS
            </span>

            <h1>My Interviews</h1>

            <p>
              Continue your AI-powered interview
              journey.
            </p>
          </div>

        </div>

        <div className="interviews-error">

          <AlertCircle size={34} />

          <h2>
            Unable to load interviews
          </h2>

          <p>{error}</p>

          <button onClick={loadInterviews}>
            <RotateCcw size={16} />
            Try Again
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="interviews-page">

      {/* HEADER */}

      <div className="interviews-page-header">

        <div>

          <span className="interviews-eyebrow">
            AI INTERVIEWS
          </span>

          <h1>
            My Interviews
          </h1>

          <p>
            Complete your AI-powered interviews
            and track your results.
          </p>

        </div>

        <button
          className="interviews-refresh"
          onClick={loadInterviews}
        >
          <RotateCcw size={16} />
          Refresh
        </button>

      </div>


      {/* SUMMARY */}

      <div className="interviews-summary">

        <div className="interviews-summary-card">

          <div className="interviews-summary-icon">
            <Video size={20} />
          </div>

          <div>
            <span>Total Interviews</span>
            <strong>
              {interviews.length}
            </strong>
          </div>

        </div>


        <div className="interviews-summary-card">

          <div className="interviews-summary-icon">
            <PlayCircle size={20} />
          </div>

          <div>
            <span>Pending</span>
            <strong>
              {
                interviews.filter(
                  item =>
                    item.status === "READY" ||
                    item.status === "IN_PROGRESS"
                ).length
              }
            </strong>
          </div>

        </div>


        <div className="interviews-summary-card">

          <div className="interviews-summary-icon">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Completed</span>
            <strong>
              {
                interviews.filter(
                  item =>
                    item.status === "COMPLETED"
                ).length
              }
            </strong>
          </div>

        </div>

      </div>


      {/* EMPTY */}

      {interviews.length === 0 ? (

        <div className="interviews-empty">

          <div className="interviews-empty-icon">
            <Video size={34} />
          </div>

          <h2>
            No interviews available
          </h2>

          <p>
            Interviews will appear here after
            you successfully complete an
            assessment.
          </p>

          <button
            onClick={() =>
              navigate(
                "/candidate/assessments"
              )
            }
          >
            View Assessments
            <ArrowRight size={17} />
          </button>

        </div>

      ) : (

        <div className="interviews-list">

          {interviews.map(interview => {

            const status =
              getStatus(
                interview.status
              );

            return (
              <div
                className="interview-list-card"
                key={`${interview.jobId}-${interview.resumeId}`}
              >

                <div className="interview-list-main">

                  <div className="interview-list-icon">
                    <Video size={25} />
                  </div>


                  <div className="interview-list-content">

                    <div className="interview-list-title-row">

                      <h2>
                        {interview.jobTitle}
                      </h2>

                      <span
                        className={
                          status.className
                        }
                      >
                        {status.icon}
                        {status.label}
                      </span>

                    </div>


                    <p className="interview-list-subtitle">
                      AI-powered personalized interview
                    </p>


                    <div className="interview-list-meta">

                      <span>
                        <FileQuestion size={15} />
                        {interview.totalQuestions}
                        {" "}Questions
                      </span>

                      <span>
                        <Clock3 size={15} />
                        AI Interview
                      </span>

                      {interview.overallScore != null && (
                        <span>
                          <Trophy size={15} />
                          Score:{" "}
                          {interview.overallScore}%
                        </span>
                      )}

                    </div>

                  </div>

                </div>


                <button
                  className="interview-list-action"
                  onClick={() =>
                    handleInterview(
                      interview
                    )
                  }
                >

                  {interview.status === "READY"
                    ? "Start Interview"
                    : interview.status === "IN_PROGRESS"
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

export default Interviews;