import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Users,
  UserCheck,
  FileText,
  Plus,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getRecruiterDashboard,
} from "../../services/recruiterDashboardService";

import "./recruiterDashboard.css";

const RecruiterDashboard = () => {

  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        setLoading(true);
        setError("");

        const data =
          await getRecruiterDashboard();

        setDashboard(data);

      } catch (error) {

        console.error(
          "Failed to load recruiter dashboard:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Unable to load recruiter dashboard."
        );

      } finally {

        setLoading(false);

      }

    };

    loadDashboard();

  }, []);


  // =========================================================
  // DATA
  // =========================================================

  const totalJobs =
    dashboard?.totalJobs ?? 0;

  const activeJobs =
    dashboard?.activeJobs ?? 0;

  const totalApplications =
    dashboard?.totalApplications ?? 0;

  const shortlistedCandidates =
    dashboard?.shortlistedCandidates ?? 0;

  const recentJobs =
    dashboard?.recentJobs || [];

  const recentApplications =
    dashboard?.recentApplications || [];

  const recentShortlisted =
    dashboard?.recentShortlistedCandidates || [];


  // =========================================================
  // CREATE JOB
  // =========================================================

  const handleCreateJob = () => {

    navigate("/recruiter/jobs/create");

  };


  // =========================================================
  // VIEW JOB
  // =========================================================

  const handleViewJob = (jobId) => {

    navigate(`/recruiter/jobs/${jobId}`);

  };


  // =========================================================
  // VIEW CANDIDATE
  // =========================================================

  const handleViewCandidates = () => {

    navigate("/recruiter/candidates");

  };

const handleViewApplication = (applicationId) => {

  if (!applicationId) {
    navigate("/recruiter/candidates");
    return;
  }

  navigate(
    `/recruiter/candidates/${applicationId}`
  );
};


useEffect(() => {

  const loadDashboard = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await getRecruiterDashboard();

      console.log("RECRUITER DASHBOARD RESPONSE:", data);
      console.log(
        "RECENT APPLICATIONS:",
        data?.recentApplications
      );

      setDashboard(data);

    } catch (error) {

      console.error(
        "Failed to load recruiter dashboard:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load recruiter dashboard."
      );

    } finally {

      setLoading(false);

    }

  };

  loadDashboard();

}, []);

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (status) => {

    switch (status) {

      case "PUBLISHED":
        return "status-published";

      case "DRAFT":
        return "status-draft";

      case "CLOSED":
        return "status-closed";

      case "ARCHIVED":
        return "status-archived";

      default:
        return "";

    }

  };


  // =========================================================
  // APPLICATION STATUS CLASS
  // =========================================================

  const getApplicationStatusClass = (status) => {

    switch (status) {

      case "SHORTLISTED":
        return "application-status-shortlisted";

      case "MATCHED":
        return "application-status-matched";

      case "ASSESSMENT_PENDING":
        return "application-status-pending";

      case "ASSESSMENT_COMPLETED":
        return "application-status-completed";

      case "INTERVIEW_PENDING":
        return "application-status-pending";

      case "INTERVIEW_COMPLETED":
        return "application-status-completed";

      case "REJECTED":
        return "application-status-rejected";

      default:
        return "application-status-default";

    }

  };


  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {

    return (

      <div className="recruiter-dashboard-loading">

        <Loader2
          size={30}
          className="recruiter-spinner"
        />

        <span>
          Loading recruiter dashboard...
        </span>

      </div>

    );

  }


  return (

    <div className="recruiter-dashboard">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="recruiter-dashboard-header">

        <div>

          <span className="recruiter-dashboard-eyebrow">
            RECRUITER WORKSPACE
          </span>

          <h1>
            Recruiter Dashboard
          </h1>

          <p>
            Manage your jobs, applications and
            candidate recruitment process.
          </p>

        </div>


        <button
          className="recruiter-create-job-btn"
          onClick={handleCreateJob}
        >

          <Plus size={18} />

          Post New Job

        </button>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div className="recruiter-dashboard-error">

          <AlertCircle size={18} />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="recruiter-stats-grid">


        {/* TOTAL JOBS */}

        <div className="recruiter-stat-card">

          <div className="recruiter-stat-top">

            <div className="recruiter-stat-icon">
              <BriefcaseBusiness size={21} />
            </div>

            <span className="recruiter-stat-label">
              TOTAL JOBS
            </span>

          </div>

          <strong className="recruiter-stat-value">
            {totalJobs}
          </strong>

          <span className="recruiter-stat-description">
            Jobs posted by you
          </span>

        </div>


        {/* ACTIVE JOBS */}

        <div className="recruiter-stat-card">

          <div className="recruiter-stat-top">

            <div className="recruiter-stat-icon">
              <CheckCircle2 size={21} />
            </div>

            <span className="recruiter-stat-label">
              ACTIVE JOBS
            </span>

          </div>

          <strong className="recruiter-stat-value">
            {activeJobs}
          </strong>

          <span className="recruiter-stat-description">
            Currently accepting applications
          </span>

        </div>


        {/* APPLICATIONS */}

        <div className="recruiter-stat-card">

          <div className="recruiter-stat-top">

            <div className="recruiter-stat-icon">
              <FileText size={21} />
            </div>

            <span className="recruiter-stat-label">
              APPLICATIONS
            </span>

          </div>

          <strong className="recruiter-stat-value">
            {totalApplications}
          </strong>

          <span className="recruiter-stat-description">
            Total candidate applications
          </span>

        </div>


        {/* SHORTLISTED */}

        <div className="recruiter-stat-card">

          <div className="recruiter-stat-top">

            <div className="recruiter-stat-icon">
              <UserCheck size={21} />
            </div>

            <span className="recruiter-stat-label">
              SHORTLISTED
            </span>

          </div>

          <strong className="recruiter-stat-value">
            {shortlistedCandidates}
          </strong>

          <span className="recruiter-stat-description">
            Candidates shortlisted
          </span>

        </div>

      </div>


      {/* =====================================================
          DASHBOARD CONTENT
      ===================================================== */}

      <div className="recruiter-dashboard-content">


        {/* ===================================================
            RECENT JOBS
        =================================================== */}

        <section className="recruiter-dashboard-card">

          <div className="recruiter-card-header">

            <div>

              <span className="recruiter-card-eyebrow">
                JOB MANAGEMENT
              </span>

              <h2>
                Recent Jobs
              </h2>

            </div>


            <button
              className="recruiter-view-all-btn"
              onClick={() =>
                navigate("/recruiter/jobs")
              }
            >

              View All

              <ArrowRight size={16} />

            </button>

          </div>


          {recentJobs.length === 0 ? (

            <div className="recruiter-empty-state">

              <div className="recruiter-empty-icon">
                <BriefcaseBusiness size={25} />
              </div>

              <h3>
                No jobs posted yet
              </h3>

              <p>
                Create your first job posting to
                start receiving candidate applications.
              </p>

              <button
                className="recruiter-empty-action"
                onClick={handleCreateJob}
              >

                <Plus size={16} />

                Create Job

              </button>

            </div>

          ) : (

            <div className="recruiter-job-list">

              {recentJobs.map((job) => (

                <div
                  key={job.id}
                  className="recruiter-job-row"
                  onClick={() =>
                    handleViewJob(job.id)
                  }
                >

                  <div className="recruiter-job-main">

                    <div className="recruiter-job-icon">
                      <BriefcaseBusiness size={18} />
                    </div>


                    <div>

                      <h3>
                        {job.title}
                      </h3>

                      <p>

                        {job.location ||
                          "Location not specified"}

                        {job.workMode &&
                          ` • ${job.workMode}`}

                      </p>

                    </div>

                  </div>


                  <div className="recruiter-job-right">

                    <span
                      className={`recruiter-job-status ${getStatusClass(
                        job.status
                      )}`}
                    >

                      {job.status}

                    </span>

                    <ArrowRight
                      size={16}
                      className="recruiter-job-arrow"
                    />

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* ===================================================
            RECENT APPLICATIONS
        =================================================== */}

        <section className="recruiter-dashboard-card">

          <div className="recruiter-card-header">

            <div>

              <span className="recruiter-card-eyebrow">
                CANDIDATE ACTIVITY
              </span>

              <h2>
                Recent Applications
              </h2>

            </div>


            <button
              className="recruiter-view-all-btn"
              onClick={() =>
  handleViewApplication(candidate.applicationId)
}
            >

              View All

              <ArrowRight size={16} />

            </button>

          </div>


          {recentApplications.length === 0 ? (

            <div className="recruiter-empty-state">

              <div className="recruiter-empty-icon">
                <Users size={25} />
              </div>

              <h3>
                No applications yet
              </h3>

              <p>
                Candidate applications will appear
                here when candidates apply to your jobs.
              </p>

            </div>

          ) : (

            <div className="recruiter-application-list">

              {recentApplications.map(
                (application) => (

                  <div
  key={application.applicationId}
  className="recruiter-application-row"
  onClick={() =>
  handleViewApplication(
    application.applicationId
  )
}
>

                    <div className="recruiter-application-icon">
                      <Users size={18} />
                    </div>


                    <div className="recruiter-application-main">

                     <h3>
  {application.candidateName ||
    `Candidate #${application.candidateId}`}
</h3>

                     <p>
  {application.jobTitle}
</p>

{application.candidateEmail && (
  <span className="recruiter-application-email">
    <Mail size={11} />
    {application.candidateEmail}
  </span>
)}

                    </div>


                    <span
                      className={`recruiter-application-status ${getApplicationStatusClass(
                        application.status
                      )}`}
                    >

                      {application.status
                        ?.replaceAll("_", " ")}

                    </span>


                    <ArrowRight
                      size={16}
                      className="recruiter-job-arrow"
                    />

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* ===================================================
            RECENT SHORTLISTED
        =================================================== */}

        <section className="recruiter-dashboard-card">

          <div className="recruiter-card-header">

            <div>

              <span className="recruiter-card-eyebrow">
                RECRUITMENT PROGRESS
              </span>

              <h2>
                Recently Shortlisted
              </h2>

            </div>


            <button
              className="recruiter-view-all-btn"
              onClick={() =>
                navigate("/recruiter/shortlisted")
              }
            >

              View All

              <ArrowRight size={16} />

            </button>

          </div>


          {recentShortlisted.length === 0 ? (

            <div className="recruiter-empty-state">

              <div className="recruiter-empty-icon">
                <UserCheck size={25} />
              </div>

              <h3>
                No shortlisted candidates
              </h3>

              <p>
                Candidates you shortlist will
                appear here.
              </p>

            </div>

          ) : (

            <div className="recruiter-application-list">

             {recentShortlisted.map(
  (candidate) => (

    <div
      key={candidate.jobMatchId}
      className="recruiter-application-row"
      onClick={() =>
        handleViewApplication(
          candidate.applicationId
        )
      }
    >

      <div className="recruiter-application-icon">
        <UserCheck size={18} />
      </div>


      <div className="recruiter-application-main">

        <h3>
          {candidate.candidateName ||
            `Candidate #${candidate.candidateId}`}
        </h3>

        <p>
          {candidate.jobTitle}
        </p>

        {candidate.candidateEmail && (
          <span className="recruiter-application-email">
            <Mail size={11} />
            {candidate.candidateEmail}
          </span>
        )}

      </div>


      {candidate.matchScore !== null &&
        candidate.matchScore !== undefined && (

          <span className="dashboard-match-score">

            {Number(
              candidate.matchScore
            ).toFixed(1)}

            <small>
              / 100
            </small>

          </span>

        )}


      <ArrowRight
        size={16}
        className="recruiter-job-arrow"
      />

    </div>

  )
)}

            </div>

          )}

        </section>

      </div>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section className="recruiter-dashboard-card recruiter-quick-actions">

        <div className="recruiter-card-header">

          <div>

            <span className="recruiter-card-eyebrow">
              QUICK ACTIONS
            </span>

            <h2>
              Recruitment Workspace
            </h2>

          </div>

        </div>


        <div className="recruiter-action-grid">


          {/* POST JOB */}

          <button
            className="recruiter-action-card"
            onClick={handleCreateJob}
          >

            <div className="recruiter-action-icon">
              <Plus size={21} />
            </div>

            <div>

              <strong>
                Post a Job
              </strong>

              <span>
                Create a new job opening
              </span>

            </div>

            <ArrowRight size={17} />

          </button>


          {/* MANAGE JOBS */}

          <button
            className="recruiter-action-card"
            onClick={() =>
              navigate("/recruiter/jobs")
            }
          >

            <div className="recruiter-action-icon">
              <BriefcaseBusiness size={21} />
            </div>

            <div>

              <strong>
                Manage Jobs
              </strong>

              <span>
                View and manage your jobs
              </span>

            </div>

            <ArrowRight size={17} />

          </button>


          {/* CANDIDATES */}

          <button
            className="recruiter-action-card"
            onClick={() =>
              navigate("/recruiter/candidates")
            }
          >

            <div className="recruiter-action-icon">
              <Users size={21} />
            </div>

            <div>

              <strong>
                View Candidates
              </strong>

              <span>
                Review candidate profiles
              </span>

            </div>

            <ArrowRight size={17} />

          </button>


          {/* SHORTLISTED */}

          <button
            className="recruiter-action-card"
            onClick={() =>
              navigate("/recruiter/shortlisted")
            }
          >

            <div className="recruiter-action-icon">
              <UserCheck size={21} />
            </div>

            <div>

              <strong>
                Shortlisted Candidates
              </strong>

              <span>
                Review shortlisted candidates
              </span>

            </div>

            <ArrowRight size={17} />

          </button>

        </div>

      </section>

    </div>
  );
};

export default RecruiterDashboard;