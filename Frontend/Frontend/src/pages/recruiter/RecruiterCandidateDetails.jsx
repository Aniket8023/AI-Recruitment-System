import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Mail,
  Phone,
  BriefcaseBusiness,
  FileText,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";

import {
  getRecruiterCandidateDetails,
} from "../../services/recruiterCandidateService";

import matchingService from "../../services/matchingService";
import resumeService from "../../services/resumeService";

import "./recruiterCandidateDetails.css";

const RecruiterCandidateDetails = () => {

  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [decisionLoading, setDecisionLoading] =
    useState(false);

  const [decisionError, setDecisionError] =
    useState("");

  const [decisionSuccess, setDecisionSuccess] =
    useState("");


  // =========================================================
  // LOAD CANDIDATE DETAILS
  // =========================================================

  useEffect(() => {

    const loadCandidate = async () => {

      try {

        setLoading(true);
        setError("");

        const data =
          await getRecruiterCandidateDetails(
            applicationId
          );

        setCandidate(data);

      } catch (err) {

        console.error(
          "Failed to load candidate:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load candidate details."
        );

      } finally {

        setLoading(false);

      }

    };

    loadCandidate();

  }, [applicationId]);


  // =========================================================
  // SHORTLIST CANDIDATE
  // =========================================================

  const handleShortlist = async () => {

    if (!candidate) {
      return;
    }

    try {

      setDecisionLoading(true);
      setDecisionError("");
      setDecisionSuccess("");

      await matchingService.shortlistCandidate(
      candidate.jobId,
      candidate.resumeId
    );

      setCandidate((prev) => ({
        ...prev,
        applicationStatus: "SHORTLISTED",
      }));

      setDecisionSuccess(
        "Candidate shortlisted successfully."
      );

    } catch (err) {

      console.error(
        "Failed to shortlist candidate:",
        err
      );

      setDecisionError(
        err.response?.data?.message ||
          "Unable to shortlist candidate."
      );

    } finally {

      setDecisionLoading(false);

    }

  };


  // =========================================================
  // REJECT CANDIDATE
  // =========================================================

  const handleReject = async () => {

    if (!candidate) {
      return;
    }

    try {

      setDecisionLoading(true);
      setDecisionError("");
      setDecisionSuccess("");

      await matchingService.rejectCandidate(
      candidate.jobId,
      candidate.resumeId
    );

      setCandidate((prev) => ({
        ...prev,
        applicationStatus: "REJECTED",
      }));

      setDecisionSuccess(
        "Candidate rejected successfully."
      );

    } catch (err) {

      console.error(
        "Failed to reject candidate:",
        err
      );

      setDecisionError(
        err.response?.data?.message ||
          "Unable to reject candidate."
      );

    } finally {

      setDecisionLoading(false);

    }

  };


  const handleViewResume = async () => {
  if (!candidate?.resumeId) {
    alert("Resume is not available.");
    return;
  }

  try {
    const response = await resumeService.getResumeFile(
      candidate.resumeId
    );

    const blob = new Blob(
      [response.data],
      {
        type: response.headers["content-type"],
      }
    );

    const fileUrl = URL.createObjectURL(blob);

    window.open(fileUrl, "_blank");

    setTimeout(() => {
      URL.revokeObjectURL(fileUrl);
    }, 60000);

  } catch (error) {
  console.error("Failed to open resume:", error);

  console.log("Status:", error.response?.status);
  console.log("Response data:", error.response?.data);
  console.log("Response headers:", error.response?.headers);

  alert(
    error.response?.data?.message ||
    "Unable to open resume."
  );
}
};
  // =========================================================
  // FORMAT STATUS
  // =========================================================

  const formatStatus = (status) => {

    if (!status) {
      return "Unknown";
    }

    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );

  };


  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {

    return (
      <div className="candidate-details-state">

        <div className="candidate-details-spinner"></div>

        <p>
          Loading candidate details...
        </p>

      </div>
    );

  }


  // =========================================================
  // ERROR STATE
  // =========================================================

  if (error) {

    return (
      <div className="candidate-details-state">

        <AlertTriangle size={42} />

        <h3>
          Unable to load candidate
        </h3>

        <p>
          {error}
        </p>

        <button
          onClick={() =>
            navigate("/recruiter/candidates")
          }
        >
          Back to Candidates
        </button>

      </div>
    );

  }


  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (!candidate) {
    return null;
  }


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="recruiter-candidate-details-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="candidate-details-topbar">

        <button
          className="candidate-details-back"
          onClick={() =>
            navigate("/recruiter/candidates")
          }
        >
          <ArrowLeft size={18} />

          Back to Candidates
        </button>

      </div>


      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}

      <section className="candidate-profile-header">

        <div className="candidate-large-avatar">

          {candidate.candidateName
            ?.charAt(0)
            ?.toUpperCase()}

        </div>


        <div className="candidate-profile-main">

          <h1>
            {candidate.candidateName}
          </h1>

          <div className="candidate-contact-row">

            <span>
              <Mail size={15} />

              {candidate.candidateEmail}
            </span>


            {candidate.candidatePhone && (

              <span>
                <Phone size={15} />

                {candidate.candidatePhone}
              </span>

            )}

          </div>

        </div>


        <div className="candidate-profile-status">

          <span>
            Application Status
          </span>

          <strong>
            {formatStatus(
              candidate.applicationStatus
            )}
          </strong>

        </div>

      </section>


      {/* =====================================================
          JOB INFORMATION
      ===================================================== */}

      <section className="candidate-detail-card">

        <div className="candidate-card-heading">

          <BriefcaseBusiness size={19} />

          <div>

            <h2>
              Applied Position
            </h2>

            <p>
              Job associated with this application
            </p>

          </div>

        </div>


        <div className="applied-job-content">

          <div className="applied-job-icon">

            <BriefcaseBusiness size={22} />

          </div>


          <div>

            <span>
              Position
            </span>

            <strong>
              {candidate.jobTitle}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================================
          AI JOB MATCH
      ===================================================== */}

      <section className="candidate-detail-card">

        <div className="candidate-card-heading">

          <BrainCircuit size={19} />

          <div>

            <h2>
              AI Job Match
            </h2>

            <p>
              AI-based candidate and job matching analysis
            </p>

          </div>

        </div>


        {candidate.matchScore !== null &&
        candidate.matchScore !== undefined ? (

          <>

            <div className="match-overview">

              <div className="match-score-large">

                <strong>
                  {Number(
                    candidate.matchScore
                  ).toFixed(1)}
                </strong>

                <span>
                  / 10
                </span>

              </div>


              <div className="match-recommendation">

                <span>
                  Recommendation
                </span>

                <strong>
                  {candidate.recommendation ||
                    "Not available"}
                </strong>

              </div>

            </div>


            <div className="match-analysis-grid">

              <div className="match-analysis-item">

                <h3>
                  Matched Technical Skills
                </h3>

                <p>
                  {candidate.matchedTechnicalSkills ||
                    "No data available"}
                </p>

              </div>


              <div className="match-analysis-item">

                <h3>
                  Missing Technical Skills
                </h3>

                <p>
                  {candidate.missingTechnicalSkills ||
                    "No data available"}
                </p>

              </div>


              <div className="match-analysis-item">

                <h3>
                  Matched Soft Skills
                </h3>

                <p>
                  {candidate.matchedSoftSkills ||
                    "No data available"}
                </p>

              </div>


              <div className="match-analysis-item">

                <h3>
                  Skill Gaps
                </h3>

                <p>
                  {candidate.skillGaps ||
                    "No data available"}
                </p>

              </div>

            </div>


            <div className="match-explanation">

              <h3>
                AI Explanation
              </h3>

              <p>
                {candidate.matchExplanation ||
                  "No explanation available."}
              </p>

            </div>

          </>

        ) : (

          <div className="no-match-data">

            <BrainCircuit size={35} />

            <h3>
              AI matching not available
            </h3>

            <p>
              A matching result has not been
              generated for this candidate yet.
            </p>

          </div>

        )}

      </section>


      {/* =====================================================
          RECRUITER DECISION
      ===================================================== */}

      <section className="candidate-decision-card">

        <div className="candidate-decision-header">

          <div>

            <span className="candidate-section-eyebrow">
              RECRUITER DECISION
            </span>

            <h3>
              Application Decision
            </h3>

            <p>
              Review the candidate's evaluation and
              make the recruitment decision.
            </p>

          </div>

        </div>


        {decisionError && (

          <div className="candidate-decision-error">

            <AlertTriangle size={17} />

            <span>
              {decisionError}
            </span>

          </div>

        )}


        {decisionSuccess && (

          <div className="candidate-decision-success">

            <CheckCircle2 size={17} />

            <span>
              {decisionSuccess}
            </span>

          </div>

        )}


        {candidate.applicationStatus ===
        "SHORTLISTED" ? (

          <div className="candidate-decision-status shortlisted">

            <CheckCircle2 size={20} />

            <div>

              <strong>
                Candidate Shortlisted
              </strong>

              <span>
                This candidate has been shortlisted
                for the position.
              </span>

            </div>

          </div>

        ) : candidate.applicationStatus ===
          "REJECTED" ? (

          <div className="candidate-decision-status rejected">

            <XCircle size={20} />

            <div>

              <strong>
                Candidate Rejected
              </strong>

              <span>
                This application has been rejected.
              </span>

            </div>

          </div>

        ) : (

          <div className="candidate-decision-actions">

            <button
              className="candidate-shortlist-button"
              onClick={handleShortlist}
              disabled={decisionLoading}
            >

              {decisionLoading ? (

                <>
                  <Loader2
                    size={17}
                    className="decision-spinner"
                  />

                  Processing...
                </>

              ) : (

                <>
                  <CheckCircle2 size={17} />

                  Shortlist Candidate
                </>

              )}

            </button>


            <button
              className="candidate-reject-button"
              onClick={handleReject}
              disabled={decisionLoading}
            >

              {decisionLoading ? (

                <>
                  <Loader2
                    size={17}
                    className="decision-spinner"
                  />

                  Processing...
                </>

              ) : (

                <>
                  <XCircle size={17} />

                  Reject Candidate
                </>

              )}

            </button>

          </div>

        )}

      </section>


      {/* =====================================================
          ASSESSMENT RESULT
      ===================================================== */}

      <section className="candidate-detail-card">

        <div className="candidate-card-heading">

          <CheckCircle2 size={19} />

          <div>

            <h2>
              Assessment Result
            </h2>

            <p>
              Candidate's technical assessment performance
            </p>

          </div>

        </div>


        {!candidate.assessmentId ? (

          <div className="no-result-data">

            <FileText size={34} />

            <h3>
              Assessment not started
            </h3>

            <p>
              This candidate has not started an
              assessment yet.
            </p>

          </div>

        ) : (

          <>

            <div className="result-summary-grid">

              <div className="result-stat">

                <span>
                  Status
                </span>

                <strong>
                  {formatStatus(
                    candidate.assessmentStatus
                  )}
                </strong>

              </div>


              <div className="result-stat">

                <span>
                  Total Questions
                </span>

                <strong>
                  {candidate.assessmentTotalQuestions ?? "-"}
                </strong>

              </div>


              <div className="result-stat">

                <span>
                  Correct Answers
                </span>

                <strong>
                  {candidate.assessmentCorrectAnswers ?? "-"}
                </strong>

              </div>


              <div className="result-stat">

                <span>
                  Score
                </span>

                <strong>

                  {candidate.assessmentScore !== null &&
                  candidate.assessmentScore !== undefined
                    ? `${Number(
                        candidate.assessmentScore
                      ).toFixed(1)}%`
                    : "-"}

                </strong>

              </div>

            </div>


            {candidate.assessmentPassed !== null &&
            candidate.assessmentPassed !== undefined && (

              <div
                className={
                  candidate.assessmentPassed
                    ? "assessment-result-banner passed"
                    : "assessment-result-banner failed"
                }
              >

                {candidate.assessmentPassed ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <AlertTriangle size={20} />
                )}

                <div>

                  <strong>
                    {candidate.assessmentPassed
                      ? "Assessment Passed"
                      : "Assessment Failed"}
                  </strong>

                  <p>
                    {candidate.assessmentPassed
                      ? "Candidate successfully cleared the assessment."
                      : "Candidate did not clear the assessment."}
                  </p>

                </div>

              </div>

            )}

          </>

        )}

      </section>


      {/* =====================================================
          INTERVIEW RESULT
      ===================================================== */}

      <section className="candidate-detail-card">

        <div className="candidate-card-heading">

          <BrainCircuit size={19} />

          <div>

            <h2>
              Interview Result
            </h2>

            <p>
              AI-powered interview evaluation
            </p>

          </div>

        </div>


        {!candidate.interviewStatus ? (

          <div className="no-result-data">

            <BrainCircuit size={34} />

            <h3>
              Interview not completed
            </h3>

            <p>
              Interview result is not available yet.
            </p>

          </div>

        ) : candidate.interviewIntegrityViolation ? (

          <div className="terminated-interview">

            <AlertTriangle size={28} />

            <div>

              <strong>
                Interview Terminated
              </strong>

              <p>
                Integrity violation detected during
                the interview.
              </p>

              <span>
                Violations:{" "}
                {candidate.interviewViolationCount ?? 0}
              </span>


              {candidate.interviewTerminationReason && (

                <span>
                  Reason:{" "}
                  {candidate.interviewTerminationReason}
                </span>

              )}

            </div>

          </div>

        ) : (

          <>

            <div className="result-summary-grid">

              <div className="result-stat">

                <span>
                  Status
                </span>

                <strong>
                  {formatStatus(
                    candidate.interviewStatus
                  )}
                </strong>

              </div>


              <div className="result-stat">

                <span>
                  Total Questions
                </span>

                <strong>
                  {candidate.interviewTotalQuestions ?? "-"}
                </strong>

              </div>


              <div className="result-stat">

                <span>
                  Answered
                </span>

                <strong>
                  {candidate.interviewAnsweredQuestions ?? "-"}
                </strong>

              </div>


              <div className="result-stat">

                <span>
                  Overall Score
                </span>

                <strong>

                  {candidate.interviewScore !== null &&
                  candidate.interviewScore !== undefined
                    ? Number(
                        candidate.interviewScore
                      ).toFixed(1)
                    : "-"}

                </strong>

              </div>

            </div>


            <div className="interview-recommendation">

              <span>
                AI Recommendation
              </span>

              <strong>
                {candidate.interviewRecommendation ||
                  "Not available"}
              </strong>

            </div>

          </>

        )}

      </section>


      {/* =====================================================
          RESUME
      ===================================================== */}

      <section className="candidate-detail-card">

        <div className="candidate-card-heading">

          <FileText size={19} />

          <div>

            <h2>
              Resume
            </h2>

            <p>
              Candidate resume information
            </p>

          </div>

        </div>


        <div className="resume-summary">

          <div className="resume-icon">

            <FileText size={23} />

          </div>


          <div>

            <strong>
              Resume #{candidate.resumeId}
            </strong>

            <span>
              Resume submitted with this application
            </span>

          </div>


<button
  className="resume-view-button"
  onClick={handleViewResume}
>
  <FileText size={18} />
  View Resume
</button>

        </div>

      </section>


      {/* =====================================================
          RECRUITMENT PROGRESS
      ===================================================== */}

      <section className="candidate-detail-card">

        <div className="candidate-card-heading">

          <CheckCircle2 size={19} />

          <div>

            <h2>
              Recruitment Progress
            </h2>

            <p>
              Current candidate journey
            </p>

          </div>

        </div>


        <div className="candidate-progress">

          {/* STEP 1 */}

          <div className="progress-step completed">

            <span>
              1
            </span>

            <strong>
              Applied
            </strong>

          </div>


          <div className="progress-line"></div>


          {/* STEP 2 */}

          <div
            className={
              candidate.matchScore !== null &&
              candidate.matchScore !== undefined
                ? "progress-step completed"
                : "progress-step"
            }
          >

            <span>
              2
            </span>

            <strong>
              AI Matching
            </strong>

          </div>


          <div className="progress-line"></div>


          {/* STEP 3 */}

          <div
            className={
              candidate.assessmentPassed === true
                ? "progress-step completed"
                : "progress-step"
            }
          >

            <span>
              3
            </span>

            <strong>
              Assessment
            </strong>

          </div>


          <div className="progress-line"></div>


          {/* STEP 4 */}

          <div
            className={
              candidate.interviewIntegrityViolation
                ? "progress-step terminated"
                : candidate.interviewStatus ===
                    "COMPLETED"
                  ? "progress-step completed"
                  : "progress-step"
            }
          >

            <span>
              4
            </span>

            <strong>

              {candidate.interviewIntegrityViolation
                ? "Terminated"
                : "Interview"}

            </strong>

          </div>

        </div>

      </section>

    </div>
  );
};

export default RecruiterCandidateDetails;