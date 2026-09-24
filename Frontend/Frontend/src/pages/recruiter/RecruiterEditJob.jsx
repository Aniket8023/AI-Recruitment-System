import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Save,
  X,
} from "lucide-react";

import api from "../../services/api";
import "./recruiterEditJob.css";

const RecruiterEditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    preferredSkills: "",
    experienceRequired: "",
    location: "",
    employmentType: "",
    workMode: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= LOAD JOB ================= */

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/jobs/${jobId}`);

        const job = response.data;

        setFormData({
          title: job.title || "",
          description: job.description || "",
          requiredSkills: job.requiredSkills || "",
          preferredSkills: job.preferredSkills || "",
          experienceRequired: job.experienceRequired || "",
          location: job.location || "",
          employmentType: job.employmentType || "",
          workMode: job.workMode || "",
        });
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

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Job title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Job description is required.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put(
        `/jobs/${jobId}`,
        {
          title: formData.title.trim(),
          description: formData.description.trim(),
          requiredSkills: formData.requiredSkills.trim(),
          preferredSkills: formData.preferredSkills.trim(),
          experienceRequired: formData.experienceRequired.trim(),
          location: formData.location.trim(),
          employmentType: formData.employmentType,
          workMode: formData.workMode,
        }
      );

      console.log("Updated job:", response.data);

      setSuccess("Job updated successfully.");

      /*
       * Give the user a moment to see the
       * success message before navigating.
       */
      setTimeout(() => {
        navigate(`/recruiter/jobs/${jobId}`);
      }, 700);
    } catch (err) {
      console.error("Update job error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update job. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="edit-job-state">
        <div className="edit-job-spinner"></div>
        <p>Loading job information...</p>
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error && !formData.title) {
    return (
      <div className="edit-job-state edit-job-error-state">
        <X size={42} />

        <h3>Unable to load job</h3>

        <p>{error}</p>

        <button
          onClick={() =>
            navigate(`/recruiter/jobs/${jobId}`)
          }
        >
          Back to Job
        </button>
      </div>
    );
  }

  return (
    <div className="recruiter-edit-job-page">

      {/* ================= HEADER ================= */}

      <div className="edit-job-header">

        <button
          type="button"
          className="edit-job-back"
          onClick={() =>
            navigate(`/recruiter/jobs/${jobId}`)
          }
        >
          <ArrowLeft size={18} />
          Back to Job
        </button>

        <div className="edit-job-title-wrapper">

          <div className="edit-job-icon">
            <BriefcaseBusiness size={24} />
          </div>

          <div>
            <h1>Edit Job</h1>
            <p>
              Update the details and requirements of this job.
            </p>
          </div>

        </div>

      </div>

      {/* ================= ALERTS ================= */}

      {error && (
        <div className="edit-job-alert error">
          <X size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="edit-job-alert success">
          <Save size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* ================= FORM ================= */}

      <form
        className="edit-job-form"
        onSubmit={handleSubmit}
      >

        {/* BASIC INFORMATION */}

        <section className="edit-form-section">

          <div className="edit-section-heading">
            <h2>Basic Information</h2>

            <p>
              Update the title and description of the position.
            </p>
          </div>

          <div className="edit-form-grid">

            <div className="edit-form-group full-width">
              <label>
                Job Title <span>*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Java Full Stack Developer"
                maxLength={150}
              />
            </div>

            <div className="edit-form-group full-width">

              <label>
                Job Description <span>*</span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={8}
                placeholder="Describe the role, responsibilities and expectations..."
              />

            </div>

          </div>

        </section>

        {/* SKILLS */}

        <section className="edit-form-section">

          <div className="edit-section-heading">

            <h2>Skills & Requirements</h2>

            <p>
              Update the skills required for this position.
            </p>

          </div>

          <div className="edit-form-grid">

            <div className="edit-form-group">

              <label>
                Required Skills
              </label>

              <input
                type="text"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                placeholder="Java, Spring Boot, MySQL"
              />

              <small>
                Separate multiple skills using commas.
              </small>

            </div>

            <div className="edit-form-group">

              <label>
                Preferred Skills
              </label>

              <input
                type="text"
                name="preferredSkills"
                value={formData.preferredSkills}
                onChange={handleChange}
                placeholder="React, AWS, Docker"
              />

              <small>
                Optional skills that are beneficial.
              </small>

            </div>

            <div className="edit-form-group">

              <label>
                Experience Required
              </label>

              <input
                type="text"
                name="experienceRequired"
                value={formData.experienceRequired}
                onChange={handleChange}
                placeholder="e.g. 0-2 years"
              />

            </div>

          </div>

        </section>

        {/* JOB DETAILS */}

        <section className="edit-form-section">

          <div className="edit-section-heading">

            <h2>Job Details</h2>

            <p>
              Update location and employment information.
            </p>

          </div>

          <div className="edit-form-grid">

            <div className="edit-form-group">

              <label>
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Pune, Maharashtra"
              />

            </div>

            <div className="edit-form-group">

              <label>
                Employment Type
              </label>

              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
              >
                <option value="">
                  Select employment type
                </option>

                <option value="FULL_TIME">
                  Full Time
                </option>

                <option value="PART_TIME">
                  Part Time
                </option>

                <option value="CONTRACT">
                  Contract
                </option>

                <option value="INTERNSHIP">
                  Internship
                </option>

              </select>

            </div>

            <div className="edit-form-group">

              <label>
                Work Mode
              </label>

              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
              >
                <option value="">
                  Select work mode
                </option>

                <option value="ONSITE">
                  On-site
                </option>

                <option value="REMOTE">
                  Remote
                </option>

                <option value="HYBRID">
                  Hybrid
                </option>

              </select>

            </div>

          </div>

        </section>

        {/* ACTIONS */}

        <div className="edit-job-actions">

          <button
            type="button"
            className="edit-cancel-button"
            onClick={() =>
              navigate(`/recruiter/jobs/${jobId}`)
            }
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="edit-save-button"
            disabled={saving}
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>

        </div>

      </form>

    </div>
  );
};

export default RecruiterEditJob;