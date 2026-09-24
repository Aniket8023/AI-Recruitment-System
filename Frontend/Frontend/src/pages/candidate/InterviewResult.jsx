import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";

import "./interviewResult.css";

import {
  Trophy,
  Video,
  Code2,
  Users,
  Target,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  RotateCcw,
  ShieldAlert,
  XCircle,
} from "lucide-react";

import interviewService from "../../services/interviewService";

const InterviewResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const candidateId =
    searchParams.get("candidateId");

  const jobId =
    searchParams.get("jobId");

  const terminated =
    searchParams.get("terminated") === "true";

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  ============================================================
  LOAD RESULT
  ============================================================
  */

  useEffect(() => {
    if (!candidateId || !jobId) {
      setError(
        "Interview result information is missing."
      );

      setLoading(false);

      return;
    }

    loadResult();
  }, [
    candidateId,
    jobId,
    terminated,
    location.state,
  ]);

  const loadResult = async () => {
    try {
      setLoading(true);
      setError("");

      console.log(
        "Loading interview result:",
        {
          candidateId,
          jobId,
        }
      );

      const data =
        await interviewService.getInterviewResult(
          candidateId,
          jobId
        );

      console.log(
        "Interview result API response:",
        data
      );

      if (!data) {
        throw new Error(
          "Interview result API returned empty data."
        );
      }

      setResult(data);

    } catch (err) {

      console.error(
        "Failed to load interview result:",
        err
      );

      console.error(
        "Backend response:",
        err?.response?.data
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load interview result."
      );

    } finally {
      setLoading(false);
    }
  };


  /*
  ============================================================
  LOADING
  ============================================================
  */

  if (loading) {
    return (
      <div className="interview-result-page">

        <div className="interview-result-loading">

          <div className="loader-spinner"></div>

          <h2>
            Loading Interview Result...
          </h2>

          <p>
            Please wait while we prepare your
            interview evaluation.
          </p>

        </div>

      </div>
    );
  }


  /*
  ============================================================
  ERROR
  ============================================================
  */

  if (error) {
    return (
      <div className="interview-result-page">

        <div className="interview-result-error">

          <div className="interview-result-error-icon">
            <AlertCircle size={38} />
          </div>

          <h2>
            Unable to Load Result
          </h2>

          <p>
            {error}
          </p>

          <div className="interview-result-error-actions">

            <button
              onClick={loadResult}
            >
              <RotateCcw size={16} />
              Try Again
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                navigate(
                  "/candidate/interviews"
                )
              }
            >
              <ArrowLeft size={16} />
              Back to Interviews
            </button>

          </div>

        </div>

      </div>
    );
  }


  /*
  ============================================================
  NO RESULT
  ============================================================
  */

  if (!result) {
    return null;
  }


  /*
  ============================================================
  TERMINATION CHECK
  ============================================================
  */

  const isTerminated =
    terminated ||
    result.interviewStatus === "TERMINATED" ||
    result.integrityViolation === true;


  /*
  ============================================================
  TERMINATED INTERVIEW
  ============================================================
  */

  if (isTerminated) {

    return (
      <div className="interview-result-page">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="interview-result-header">

          <button
            className="interview-result-back"
            onClick={() =>
              navigate(
                "/candidate/interviews"
              )
            }
          >
            <ArrowLeft size={17} />
            Back to Interviews
          </button>

          <span className="interview-result-eyebrow">
            AI INTERVIEW SECURITY
          </span>

          <h1>
            Interview Terminated
          </h1>

          <p>
            Your interview was automatically
            terminated after the maximum number
            of security violations was reached.
          </p>

        </div>


        {/* ==================================================
            TERMINATION HERO
        ================================================== */}

        <div className="interview-result-termination-hero">

          <div className="interview-result-termination-icon">
            <ShieldAlert size={44} />
          </div>

          <span>
            INTERVIEW TERMINATED
          </span>

          <h2>
            Security Violation Detected
          </h2>

          <p>
            The interview could not be completed
            because the permitted number of
            interview integrity violations was
            reached.
          </p>

        </div>


        {/* ==================================================
            SECURITY STATUS
        ================================================== */}

        <div className="interview-result-termination-grid">

          <div className="interview-termination-card">

            <div className="interview-termination-icon">
              <XCircle size={22} />
            </div>

            <span>
              Interview Status
            </span>

            <strong>
              TERMINATED
            </strong>

            <small>
              Interview ended automatically
            </small>

          </div>


          <div className="interview-termination-card">

            <div className="interview-termination-icon">
              <ShieldAlert size={22} />
            </div>

            <span>
              Integrity Violations
            </span>

            <strong>
              {result.violationCount ?? 0}/3
            </strong>

            <small>
              Maximum violations reached
            </small>

          </div>


          <div className="interview-termination-card">

            <div className="interview-termination-icon">
              <Video size={22} />
            </div>

            <span>
              Interview Result
            </span>

            <strong>
              REJECTED
            </strong>

            <small>
              Application status updated
            </small>

          </div>

        </div>


        {/* ==================================================
            TERMINATION REASON
        ================================================== */}

        <div className="interview-result-termination-reason">

          <div className="interview-result-section-title">

            <div>
              <ShieldAlert size={19} />
            </div>

            <div>

              <span>
                SECURITY EVENT
              </span>

              <h2>
                Termination Reason
              </h2>

            </div>

          </div>

          <p>
            {result.terminationReason ||
              "The interview was terminated because the maximum number of security violations was reached."}
          </p>

        </div>


        {/* ==================================================
            SUMMARY
        ================================================== */}

        <div className="interview-result-summary-card">

          <div className="interview-result-section-title">

            <div>
              <Video size={19} />
            </div>

            <div>

              <span>
                INTERVIEW STATUS
              </span>

              <h2>
                Interview Summary
              </h2>

            </div>

          </div>

          <p>
            {result.summary ||
              "The interview was terminated before a final evaluation could be completed."}
          </p>

        </div>


        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="interview-result-actions">

          <button
            className="interview-result-secondary"
            onClick={() =>
              navigate(
                "/candidate/interviews"
              )
            }
          >
            <ArrowLeft size={17} />
            Back to Interviews
          </button>

          <button
            className="interview-result-primary"
            onClick={() =>
              navigate(
                "/candidate/dashboard"
              )
            }
          >
            Go to Dashboard
            <ArrowRight size={17} />
          </button>

        </div>

      </div>
    );
  }


  /*
  ============================================================
  NORMAL COMPLETED INTERVIEW
  ============================================================
  */

  const overallScore =
    result.overallScore ?? 0;

  const averageScore =
    result.averageScore ?? 0;


  return (
    <div className="interview-result-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="interview-result-header">

        <button
          className="interview-result-back"
          onClick={() =>
            navigate(
              "/candidate/interviews"
            )
          }
        >
          <ArrowLeft size={17} />
          Back to Interviews
        </button>

        <span className="interview-result-eyebrow">
          AI INTERVIEW ANALYSIS
        </span>

        <h1>
          Interview Result
        </h1>

        <p>
          Your AI-powered interview evaluation
          has been completed successfully.
        </p>

      </div>


      {/* ==================================================
          OVERALL SCORE
      ================================================== */}

      <div className="interview-result-hero">

        <div className="interview-result-trophy">
          <Trophy size={38} />
        </div>

        <span>
          Overall Interview Score
        </span>

        <strong>
          {overallScore}%
        </strong>

        <p>
          Average evaluation score:{" "}
          <b>
            {averageScore}/10
          </b>
        </p>

      </div>


      {/* ==================================================
          SCORE CARDS
      ================================================== */}

      <div className="interview-result-score-grid">

        {/* TECHNICAL */}

        <div className="interview-score-card">

          <div className="interview-score-icon">
            <Code2 size={21} />
          </div>

          <span>
            Technical
          </span>

          <strong>
            {result.technicalScore ?? 0}%
          </strong>

          <small>
            Technical knowledge
          </small>

        </div>


        {/* HR */}

        <div className="interview-score-card">

          <div className="interview-score-icon">
            <Users size={21} />
          </div>

          <span>
            HR
          </span>

          <strong>
            {result.hrScore ?? 0}%
          </strong>

          <small>
            Communication & HR
          </small>

        </div>


        {/* SKILL GAP */}

        <div className="interview-score-card">

          <div className="interview-score-icon">
            <Target size={21} />
          </div>

          <span>
            Skill Gap
          </span>

          <strong>
            {result.skillGapScore ?? 0}%
          </strong>

          <small>
            Skill alignment
          </small>

        </div>


        {/* QUESTIONS */}

        <div className="interview-score-card">

          <div className="interview-score-icon">
            <Video size={21} />
          </div>

          <span>
            Questions
          </span>

          <strong>
            {result.answeredQuestions ?? 0}/
            {result.totalQuestions ?? 0}
          </strong>

          <small>
            Questions answered
          </small>

        </div>

      </div>


      {/* ==================================================
          RECOMMENDATION
      ================================================== */}

      <div className="interview-result-recommendation-card">

        <div>

          <span>
            AI Recommendation
          </span>

          <h2>
            {result.recommendation ||
              "Not Available"}
          </h2>

        </div>

        <div className="interview-result-recommendation-icon">
          <Trophy size={25} />
        </div>

      </div>


      {/* ==================================================
          SUMMARY
      ================================================== */}

      <div className="interview-result-summary-card">

        <div className="interview-result-section-title">

          <div>
            <Video size={19} />
          </div>

          <div>

            <span>
              AI EVALUATION
            </span>

            <h2>
              Interview Summary
            </h2>

          </div>

        </div>

        <p>
          {result.summary ||
            "No interview summary is available."}
        </p>

      </div>


      {/* ==================================================
          FOOTER ACTIONS
      ================================================== */}

      <div className="interview-result-actions">

        <button
          className="interview-result-secondary"
          onClick={() =>
            navigate(
              "/candidate/interviews"
            )
          }
        >
          <ArrowLeft size={17} />
          Back to Interviews
        </button>

        <button
          className="interview-result-primary"
          onClick={() =>
            navigate(
              "/candidate/dashboard"
            )
          }
        >
          Go to Dashboard
          <ArrowRight size={17} />
        </button>

      </div>

    </div>
  );
};

export default InterviewResult;