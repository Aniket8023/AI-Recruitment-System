import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BriefcaseBusiness, Plus, X } from "lucide-react";
import api from "../../services/api";
import "./recruiterCreateJob.css";

const RecruiterCreateJob = () => {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Job title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Job description is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/jobs", {
        title: formData.title.trim(),
        description: formData.description.trim(),
        requiredSkills: formData.requiredSkills.trim(),
        preferredSkills: formData.preferredSkills.trim(),
        experienceRequired: formData.experienceRequired.trim(),
        location: formData.location.trim(),
        employmentType: formData.employmentType,
        workMode: formData.workMode,
      });

      console.log("Job created:", response.data);

      navigate("/recruiter/jobs");
    } catch (err) {
      console.error("Create job error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create job. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recruiter-create-job-page">

      {/* HEADER */}
      <div className="create-job-header">

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/recruiter/jobs")}
        >
          <ArrowLeft size={18} />
          Back to Jobs
        </button>

        <div className="create-job-heading">
          <div className="create-job-icon">
            <BriefcaseBusiness size={24} />
          </div>

          <div>
            <h1>Create New Job</h1>
            <p>
              Create a job opening and add the requirements for candidates.
            </p>
          </div>
        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="create-job-error">
          <X size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* FORM */}
      <form
        className="create-job-form"
        onSubmit={handleSubmit}
      >

        {/* BASIC INFORMATION */}
        <section className="form-section">

          <div className="section-heading">
            <h2>Basic Information</h2>
            <p>Provide the basic details about this position.</p>
          </div>

          <div className="form-grid">

            <div className="form-group full-width">
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

            <div className="form-group full-width">
              <label>
                Job Description <span>*</span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, and expectations..."
                rows={7}
              />
            </div>

          </div>

        </section>

        {/* SKILLS */}
        <section className="form-section">

          <div className="section-heading">
            <h2>Skills & Requirements</h2>
            <p>
              Add the technical and professional skills required for the role.
            </p>
          </div>

          <div className="form-grid">

            <div className="form-group">

              <label>
                Required Skills
              </label>

              <input
                type="text"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                placeholder="Java, Spring Boot, MySQL, REST API"
              />

              <small>
                Separate multiple skills using commas.
              </small>

            </div>

            <div className="form-group">

              <label>
                Preferred Skills
              </label>

              <input
                type="text"
                name="preferredSkills"
                value={formData.preferredSkills}
                onChange={handleChange}
                placeholder="AWS, Docker, React, Git"
              />

              <small>
                Optional skills that are beneficial for the role.
              </small>

            </div>

            <div className="form-group">

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
        <section className="form-section">

          <div className="section-heading">
            <h2>Job Details</h2>
            <p>Specify the location and employment information.</p>
          </div>

          <div className="form-grid">

            <div className="form-group">

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

            <div className="form-group">

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

            <div className="form-group">

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
        <div className="create-job-actions">

          <button
            type="button"
            className="cancel-job-button"
            onClick={() => navigate("/recruiter/jobs")}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="create-job-button"
            disabled={loading}
          >
            {loading ? (
              "Creating..."
            ) : (
              <>
                <Plus size={18} />
                Create Job
              </>
            )}
          </button>

        </div>

      </form>

    </div>
  );
};

export default RecruiterCreateJob;