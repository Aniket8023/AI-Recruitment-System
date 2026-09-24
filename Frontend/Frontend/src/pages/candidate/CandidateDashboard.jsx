import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  ArrowUpRight,
  MapPin,
  Building2,
  ChevronRight,
  Sparkles,
  TrendingUp,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import applicationService from "../../services/applicationService";
import assessmentService from "../../services/assessmentService";
import interviewService from "../../services/interviewService";
import matchingService from "../../services/matchingService";
import resumeService from "../../services/resumeService";

const CandidateDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [interviews, setInterviews] = useState([]);
const [recommendedJobs, setRecommendedJobs] =
  useState([]);
  const [resumes, setResumes] = useState([]);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  ============================================================
  LOAD DASHBOARD DATA
  ============================================================
  */

  const loadDashboardData = async () => {
    if (!user?.userId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

     const [
  applicationData,
  assessmentData,
  interviewData,
  recommendedJobData,
  resumeData,
] = await Promise.all([
  applicationService.getMyApplications(),
  assessmentService.getMyAssessments(),
  interviewService.getMyInterviews(user.userId),
  matchingService.getRecommendedJobs(user.userId),
  resumeService.getMyResumes(user.userId),
]);
setApplications(applicationData || []);
setAssessments(assessmentData || []);
setInterviews(interviewData || []);
setRecommendedJobs(recommendedJobData || []);
setResumes(resumeData || []);

    } catch (err) {
      console.error(
        "Failed to load dashboard data:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user?.userId]);

  /*
  ============================================================
  CALCULATE DASHBOARD STATISTICS
  ============================================================
  */

  /*
============================================================
PROFILE COMPLETION
============================================================
*/

const profileCompletionItems = [
  {
    completed:
      !!user?.fullName &&
      user.fullName.trim().length > 0,
    weight: 25,
  },
  {
    completed:
      !!user?.email &&
      user.email.trim().length > 0,
    weight: 25,
  },
  {
    completed: resumes.length > 0,
    weight: 50,
  },
];

const profileCompletion = profileCompletionItems.reduce(
  (total, item) =>
    total + (item.completed ? item.weight : 0),
  0
);

  const shortlistedCount = applications.filter(
    (application) =>
      application.status === "SHORTLISTED"
  ).length;

  const pendingAssessmentCount = assessments.filter(
    (assessment) =>
      assessment.status === "CREATED" ||
      assessment.status === "IN_PROGRESS"
  ).length;

  const activeInterviewCount = interviews.filter(
    (interview) =>
      interview.status === "READY" ||
      interview.status === "IN_PROGRESS"
  ).length;

  const stats = [
    {
      title: "Applications",
      value: applications.length,
      description: "Total applications",
      icon: BriefcaseBusiness,
      type: "primary",
    },
    {
      title: "Shortlisted",
      value: shortlistedCount,
      description: "Companies interested",
      icon: CheckCircle2,
      type: "success",
    },
    {
      title: "Assessments",
      value: pendingAssessmentCount,
      description: "Pending assessments",
      icon: ClipboardCheck,
      type: "warning",
    },
    {
      title: "Interviews",
      value: activeInterviewCount,
      description: "Upcoming interviews",
      icon: Clock3,
      type: "info",
    },
  ];

  /*
  ============================================================
  RECENT APPLICATIONS
  ============================================================
  */

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(
          b.appliedAt ||
            b.createdAt ||
            0
        ) -
        new Date(
          a.appliedAt ||
            a.createdAt ||
            0
        )
    )
    .slice(0, 5);

  /*
  ============================================================
  LOADING
  ============================================================
  */

  if (loading) {
    return (
      <div className="candidate-dashboard">

        <section className="dashboard-welcome">

          <div className="welcome-content">

            <div className="welcome-badge">
              <Sparkles size={14} />
              AI-powered career workspace
            </div>

            <h2>
              Good to see you,{" "}
              <span>
                {user?.fullName?.split(" ")[0] ||
                  "Candidate"}
              </span>
            </h2>

            <p>
              Loading your recruitment dashboard...
            </p>

          </div>

          <div className="welcome-decoration">
            <TrendingUp
              size={72}
              strokeWidth={1}
            />
          </div>

        </section>

        <div className="dashboard-loading">

          <div className="loader-spinner"></div>

          <p>
            Loading dashboard...
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
      <div className="candidate-dashboard">

        <div className="dashboard-error">

          <AlertCircle size={35} />

          <h2>
            Unable to load dashboard
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={loadDashboardData}
          >
            <RotateCcw size={16} />
            Try Again
          </button>

        </div>

      </div>
    );
  }

  /*
  ============================================================
  DASHBOARD
  ============================================================
  */

  return (
    <div className="candidate-dashboard">

      {/* =====================================================
          WELCOME SECTION
      ===================================================== */}

      <section className="dashboard-welcome">

        <div className="welcome-content">

          <div className="welcome-badge">
            <Sparkles size={14} />
            AI-powered career workspace
          </div>

          <h2>
            Good to see you,{" "}
            <span>
              {user?.fullName?.split(" ")[0] ||
                "Candidate"}
            </span>
          </h2>

          <p>
            Keep track of your applications,
            discover relevant opportunities and
            complete your recruitment journey.
          </p>

        </div>

        <div className="welcome-decoration">
          <TrendingUp
            size={72}
            strokeWidth={1}
          />
        </div>

      </section>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="dashboard-stats">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (
            <div
              className="stat-card"
              key={stat.title}
            >

              <div className="stat-card-top">

                <div
                  className={`stat-icon ${stat.type}`}
                >
                  <Icon size={19} />
                </div>

                <ArrowUpRight
                  size={16}
                  className="stat-arrow"
                />

              </div>

              <div className="stat-value">
                {stat.value}
              </div>

              <div className="stat-title">
                {stat.title}
              </div>

              <div className="stat-description">
                {stat.description}
              </div>

            </div>
          );
        })}

      </section>


      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="dashboard-main-grid">


        {/* ===================================================
            RECOMMENDED JOBS
        =================================================== */}

        <section className="dashboard-section recommended-section">

          <div className="section-header">

            <div>

              <h3>
                Recommended for you
              </h3>

              <p>
                Jobs matched with your profile and
                skills
              </p>

            </div>

            <button
              className="view-all-button"
              onClick={() =>
                navigate("/candidate/jobs")
              }
            >
              View all
              <ChevronRight size={15} />
            </button>

          </div>


          {/* Temporary recommended jobs */}

         <div className="job-list">

  {recommendedJobs.length === 0 ? (

    <div className="dashboard-empty">

      <BriefcaseBusiness size={30} />

      <h4>
        No recommendations yet
      </h4>

      <p>
        Complete your profile and upload a
        resume to get AI-powered job
        recommendations.
      </p>

      <button
        onClick={() =>
          navigate("/candidate/jobs")
        }
      >
        Browse Jobs
        <ArrowRight size={16} />
      </button>

    </div>

  ) : (

    recommendedJobs.map((job) => (

      <div
        className="recommended-job"
        key={job.jobId}
      >

        <div className="job-company-logo">
          <Building2 size={19} />
        </div>


        <div className="job-information">

          <h4>
            {job.jobTitle}
          </h4>

          <p className="job-company">
            {job.companyName ||
              "Company"}
          </p>

          <div className="job-meta">

            <span>
              <MapPin size={13} />

              {job.location ||
                "Location not specified"}
            </span>

            {job.workMode && (
              <span className="job-mode">
                {job.workMode}
              </span>
            )}

            {job.recommendation && (
              <span>
                {job.recommendation
                  .replaceAll("_", " ")}
              </span>
            )}

          </div>

        </div>


        <div className="job-match">

          <div className="match-score">
            {Math.round(
              job.matchScore || 0
            )}%
          </div>

          <span>
            Match
          </span>

        </div>


        <button
          className="job-arrow"
          onClick={() =>
            navigate(
              `/candidate/jobs/${job.jobId}`
            )
          }
        >
          <ArrowUpRight size={17} />
        </button>

      </div>

    ))

  )}

</div>

        </section>


        {/* ===================================================
            PROFILE COMPLETION
        =================================================== */}

        <section className="dashboard-section profile-section">

          <div className="section-header">

            <div>

              <h3>
                Profile strength
              </h3>

              <p>
                Improve your profile to get better
                matches
              </p>

            </div>

          </div>


          <div className="profile-score">

          <div
  className="profile-circle"
  style={{
    "--progress": `${profileCompletion * 3.6}deg`,
  }}
>
  <strong>
    {profileCompletion}%
  </strong>

  <span>
    Complete
  </span>
</div>

            <div className="profile-message">

              <div className="profile-message">

  <strong>
    {profileCompletion >= 100
      ? "Your profile is complete"
      : profileCompletion >= 75
      ? "Your profile is looking good"
      : profileCompletion >= 50
      ? "Your profile is halfway there"
      : "Complete your profile"}
  </strong>

  <p>
    {profileCompletion >= 100
      ? "Your profile and resume are ready for better AI job recommendations."
      : "Complete your profile and upload a resume to improve your AI job recommendations."}
  </p>

</div>

            </div>

          </div>


          <div className="profile-progress">

            <div className="progress-label">

              <span>
                Profile completion
              </span>

            <strong>
  {profileCompletion}%
</strong>

            </div>

            <div className="progress-track">

              <div
                className="progress-value"
                              style={{
                  width: `${profileCompletion}%`,
                }}
              />

            </div>

          </div>


          <button
            className="complete-profile-button"
            onClick={() =>
              navigate("/candidate/profile")
            }
          >
            Complete profile
            <ArrowUpRight size={15} />
          </button>

        </section>

      </div>


      {/* =====================================================
          RECENT APPLICATIONS
      ===================================================== */}

      <section className="dashboard-section applications-section">

        <div className="section-header">

          <div>

            <h3>
              Recent applications
            </h3>

            <p>
              Track the latest updates on your
              applications
            </p>

          </div>

          <button
            className="view-all-button"
            onClick={() =>
              navigate(
                "/candidate/applications"
              )
            }
          >
            View all
            <ChevronRight size={15} />
          </button>

        </div>


        {recentApplications.length === 0 ? (

          <div className="dashboard-empty">

            <BriefcaseBusiness size={30} />

            <h4>
              No applications yet
            </h4>

            <p>
              Start exploring jobs and apply
              for positions that match your
              skills.
            </p>

            <button
              onClick={() =>
                navigate(
                  "/candidate/jobs"
                )
              }
            >
              Browse Jobs
              <ArrowRight size={16} />
            </button>

          </div>

        ) : (

          <div className="applications-table">

            <div className="application-table-header">

              <span>
                Position
              </span>

              <span>
                Company
              </span>

              <span>
                Date applied
              </span>

              <span>
                Status
              </span>

              <span></span>

            </div>


            {recentApplications.map(
              (application) => {

                const status =
                  application.status ||
                  "APPLIED";

                return (
                  <div
                    className="application-row"
                    key={
                      application.applicationId
                    }
                  >

                    <div className="application-position">

                      <div className="mini-company-logo">
                        <BriefcaseBusiness
                          size={15}
                        />
                      </div>

                      <strong>
                        {
                          application.jobTitle ||
                          application.job?.title ||
                          application.role ||
                          "Job Application"
                        }
                      </strong>

                    </div>


                    <span className="application-company">

                      {
                        application.companyName ||
                        application.company ||
                        application.job?.companyName ||
                        "Company"
                      }

                    </span>


                    <span className="application-date">

                      {application.appliedAt
                        ? new Date(
                            application.appliedAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : application.createdAt
                        ? new Date(
                            application.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "Recently"}

                    </span>


                    <span
                      className={`application-status ${status
                        .toLowerCase()
                        .replaceAll("_", "-")
                        .replaceAll(
                          " ",
                          "-"
                        )}`}
                    >
                      {status.replaceAll(
                        "_",
                        " "
                      )}
                    </span>


                    <button
                      className="row-action"
                      onClick={() =>
                        application.applicationId &&
                        navigate(
                          `/candidate/applications/${application.applicationId}`
                        )
                      }
                    >
                      <ChevronRight
                        size={16}
                      />
                    </button>

                  </div>
                );
              }
            )}

          </div>

        )}

      </section>

    </div>
  );
};

export default CandidateDashboard;