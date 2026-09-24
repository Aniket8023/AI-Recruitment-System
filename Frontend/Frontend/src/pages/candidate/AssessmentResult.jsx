import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
  ClipboardCheck,
  ArrowRight,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

import assessmentService from "../../services/assessmentService";
import { useAuth } from "../../context/AuthContext";

const AssessmentResult = () => {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const assessmentId =
    searchParams.get("assessmentId");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    if (!assessmentId) {
      setError("Assessment ID is missing.");
      setLoading(false);
      return;
    }

    loadResult();

  }, [assessmentId]);

  const { user } = useAuth();

  const loadResult = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await assessmentService.getAssessmentResult(
          assessmentId
        );

      setResult(data);

    } catch (err) {

      console.error(
        "Failed to load assessment result:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load assessment result."
      );

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return (
      <div className="assessment-result-page">

        <div className="assessment-result-loading">
          <div className="loader-spinner"></div>
          <p>Loading assessment result...</p>
        </div>

      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="assessment-result-page">

        <div className="assessment-result-error">

          <AlertCircle size={36} />

          <h2>Unable to load result</h2>

          <p>
            {error ||
              "Assessment result could not be found."}
          </p>

          <button
            onClick={loadResult}
          >
            <RotateCcw size={16} />
            Try Again
          </button>

        </div>

      </div>
    );
  }

  const passed =
    Boolean(result.passed);

  return (
    <div className="assessment-result-page">

      {/* HEADER */}

      <div className="assessment-result-header">

        <div>

          <span className="assessment-result-eyebrow">
            ASSESSMENT RESULT
          </span>

          <h1>
            Assessment Completed
          </h1>

          <p>
            Here is your performance summary.
          </p>

        </div>

        <button
          className="assessment-result-back"
          onClick={() =>
            navigate(
              "/candidate/assessments"
            )
          }
        >
          Back to Assessments
        </button>

      </div>


      {/* RESULT HERO */}

      <div
        className={`assessment-result-hero ${
          passed
            ? "result-passed"
            : "result-failed"
        }`}
      >

        <div className="assessment-result-hero-icon">

          {passed ? (
            <CheckCircle2 size={34} />
          ) : (
            <XCircle size={34} />
          )}

        </div>

        <div>

          <span>
            {passed
              ? "Assessment Passed"
              : "Assessment Not Passed"}
          </span>

          <h2>
            {result.overallScore}%
          </h2>

          <p>
            {result.recommendation}
          </p>

        </div>

      </div>


      {/* SCORE CARDS */}

      <div className="assessment-result-score-grid">

        <div className="assessment-result-score-card">

          <Target size={21} />

          <span>
            Overall Score
          </span>

          <strong>
            {result.overallScore}%
          </strong>

        </div>


        <div className="assessment-result-score-card">

          <ClipboardCheck size={21} />

          <span>
            Correct Answers
          </span>

          <strong>
            {result.correctAnswers}
            <small>
              /{result.totalQuestions}
            </small>
          </strong>

        </div>


        <div className="assessment-result-score-card">

          <Trophy size={21} />

          <span>
            Attempted
          </span>

          <strong>
            {result.attemptedQuestions}
            <small>
              /{result.totalQuestions}
            </small>
          </strong>

        </div>

      </div>


      {/* CATEGORY SCORES */}

      <div className="assessment-result-card">

        <div className="assessment-result-card-heading">

          <div>

            <h2>
              Performance Breakdown
            </h2>

            <p>
              Your score across different
              assessment categories.
            </p>

          </div>

        </div>


        <div className="assessment-result-breakdown">

          <div>
            <span>Aptitude</span>

            <strong>
              {result.aptitudeScore ?? 0}%
            </strong>

            <div className="result-progress">
              <div
                style={{
                  width: `${result.aptitudeScore ?? 0}%`,
                }}
              />
            </div>
          </div>


          <div>
            <span>Technical</span>

            <strong>
              {result.technicalScore ?? 0}%
            </strong>

            <div className="result-progress">
              <div
                style={{
                  width: `${result.technicalScore ?? 0}%`,
                }}
              />
            </div>
          </div>


          <div>
            <span>Coding</span>

            <strong>
              {result.codingScore ?? 0}%
            </strong>

            <div className="result-progress">
              <div
                style={{
                  width: `${result.codingScore ?? 0}%`,
                }}
              />
            </div>
          </div>

        </div>

      </div>


      {/* FEEDBACK */}

      <div className="assessment-result-card">

        <h2>
          AI Feedback
        </h2>

        <p className="assessment-result-feedback">
          {result.feedback}
        </p>

      </div>


      {/* NEXT STEP */}

      {passed && (

        <div className="assessment-result-next">

          <div>

            <span>
              NEXT STAGE
            </span>

            <h2>
              You are eligible for the AI Interview
            </h2>

            <p>
              Continue to the interview stage
              to proceed with your application.
            </p>

          </div>

                    <button
  onClick={() =>
    navigate(
      `/candidate/interview?jobId=${result.jobId}&resumeId=${result.resumeId}`
    )
  }
>
  Continue to Interview
  <ArrowRight size={17} />
</button>

        </div>

      )}

    </div>
  );
};

export default AssessmentResult;