import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Edit3,
  MapPin,
  Clock3,
  Building2,
  FileText,
  Code2,
} from "lucide-react";

import api from "../../services/api";
import "./recruiterJobDetails.css";

const RecruiterJobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/jobs/${jobId}`);

        setJob(response.data);
      } catch (err) {
        console.error("Failed to load job:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load job details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  const getStatusClass = (status) => {
    switch (status) {
      case "PUBLISHED":
        return "job-status published";

      case "DRAFT":
        return "job-status draft";

      case "CLOSED":
        return "job-status closed";

      case "ARCHIVED":
        return "job-status archived";

      default:
        return "job-status";
    }
  };

  if (loading) {
    return (
      <div className="recruiter-job-details-state">
        <div className="details-spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recruiter-job-details-state error-state">
        <FileText size={40} />
        <h3>Unable to load job</h3>
        <p>{error}</p>

        <button
          onClick={() => navigate("/recruiter/jobs")}
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="recruiter-job-details-page">

      {/* TOP BAR */}

      <div className="job-details-topbar">

        <button
          className="job-details-back"
          onClick={() => navigate("/recruiter/jobs")}
        >
          <ArrowLeft size={18} />
          Back to Jobs
        </button>

        <button
          className="job-edit-button"
          onClick={() =>
            navigate(`/recruiter/jobs/${jobId}/edit`)
          }
        >
          <Edit3 size={17} />
          Edit Job
        </button>

      </div>

      {/* JOB HEADER */}

      <div className="job-details-header">

        <div className="job-details-title-section">

          <div className="job-details-icon">
            <BriefcaseBusiness size={28} />
          </div>

          <div>
            <div className="job-title-row">
              <h1>{job.title}</h1>

              <span className={getStatusClass(job.status)}>
                {job.status}
              </span>
            </div>

            <div className="job-meta-row">

              {job.location && (
                <span>
                  <MapPin size={16} />
                  {job.location}
                </span>
              )}

              {job.employmentType && (
                <span>
                  <Building2 size={16} />
                  {job.employmentType.replace("_", " ")}
                </span>
              )}

              {job.workMode && (
                <span>
                  <Clock3 size={16} />
                  {job.workMode}
                </span>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="job-details-content">

        {/* DESCRIPTION */}

        <section className="job-details-card">

          <div className="details-card-heading">
            <FileText size={19} />

            <div>
              <h2>Job Description</h2>
              <p>Role overview and responsibilities</p>
            </div>
          </div>

          <div className="job-description">
            {job.description || "No description provided."}
          </div>

        </section>

        {/* SKILLS */}

        <section className="job-details-card">

          <div className="details-card-heading">
            <Code2 size={19} />

            <div>
              <h2>Skills & Requirements</h2>
              <p>Skills required for this position</p>
            </div>
          </div>

          <div className="skills-section">

            <div className="skill-group">
              <h3>Required Skills</h3>

              {job.requiredSkills ? (
                <div className="skill-list">
                  {job.requiredSkills
                    .split(",")
                    .map((skill, index) => (
                      <span
                        className="skill-tag required"
                        key={index}
                      >
                        {skill.trim()}
                      </span>
                    ))}
                </div>
              ) : (
                <p className="no-data">
                  No required skills specified.
                </p>
              )}
            </div>

            <div className="skill-group">
              <h3>Preferred Skills</h3>

              {job.preferredSkills ? (
                <div className="skill-list">
                  {job.preferredSkills
                    .split(",")
                    .map((skill, index) => (
                      <span
                        className="skill-tag preferred"
                        key={index}
                      >
                        {skill.trim()}
                      </span>
                    ))}
                </div>
              ) : (
                <p className="no-data">
                  No preferred skills specified.
                </p>
              )}
            </div>

          </div>

        </section>

        {/* REQUIREMENTS */}

        <section className="job-details-card">

          <div className="details-card-heading">
            <BriefcaseBusiness size={19} />

            <div>
              <h2>Experience & Work Details</h2>
              <p>Additional information about this role</p>
            </div>
          </div>

          <div className="requirements-grid">

            <div className="requirement-item">
              <span>Experience Required</span>
              <strong>
                {job.experienceRequired || "Not specified"}
              </strong>
            </div>

            <div className="requirement-item">
              <span>Location</span>
              <strong>
                {job.location || "Not specified"}
              </strong>
            </div>

            <div className="requirement-item">
              <span>Employment Type</span>
              <strong>
                {job.employmentType
                  ? job.employmentType.replace("_", " ")
                  : "Not specified"}
              </strong>
            </div>

            <div className="requirement-item">
              <span>Work Mode</span>
              <strong>
                {job.workMode || "Not specified"}
              </strong>
            </div>

          </div>

        </section>

      </div>

    </div>
  );
};

export default RecruiterJobDetails;