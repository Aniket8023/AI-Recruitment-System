import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Send,
  Upload,
  X,
} from "lucide-react";

import jobService from "../../services/jobService";
import resumeService from "../../services/resumeService";
import applicationService from "../../services/applicationService";
import { useAuth } from "../../context/AuthContext";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [applying, setApplying] = useState(false);
const [alreadyApplied, setAlreadyApplied] = useState(false);
const [checkingApplication, setCheckingApplication] = useState(true);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [error, setError] = useState("");
  const [resumeError, setResumeError] = useState("");

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [applicationError, setApplicationError] = useState("");

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
  try {
    setLoading(true);
    setCheckingApplication(true);
    setError("");

    const [jobData, applications] = await Promise.all([
      jobService.getPublicJob(jobId),
      applicationService.getMyApplications(),
    ]);

    setJob(jobData);

    const hasApplied = (applications || []).some(
      (application) =>
        Number(application.jobId) === Number(jobId)
    );

    setAlreadyApplied(hasApplied);

  } catch (err) {
    console.error(err);

    setError(
      err.response?.data?.message ||
        "Unable to load job details."
    );
  } finally {
    setLoading(false);
    setCheckingApplication(false);
  }
};

  const openApplyModal = async () => {

    if (alreadyApplied) {
    return;
  }

    setShowApplyModal(true);
    setSuccessMessage("");
    setApplicationError("");
    setResumeError("");

    try {
      setResumeLoading(true);

      const data = await resumeService.getMyResumes(
        user.userId
      );

      setResumes(data);

      if (data.length > 0) {
        setSelectedResumeId(data[0].resumeId);
      }
    } catch (err) {
      console.error(err);

      setResumeError(
        err.response?.data?.message ||
          "Unable to load your resumes."
      );
    } finally {
      setResumeLoading(false);
    }
  };

  const handleResumeFileChange = (event) => {
  const file = event.target.files?.[0];

  setApplicationError("");
  setResumeError("");

  if (!file) {
    setSelectedFile(null);
    return;
  }

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.type)) {
    setResumeError(
      "Only PDF and DOCX resume files are supported."
    );

    event.target.value = "";
    setSelectedFile(null);
    return;
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    setResumeError(
      "Resume file size must be less than 5 MB."
    );

    event.target.value = "";
    setSelectedFile(null);
    return;
  }

  setSelectedFile(file);
};

const handleResumeUpload = async () => {
  if (!selectedFile) {
    setResumeError("Please select a resume first.");
    return;
  }

  try {
    setUploadingResume(true);
    setResumeError("");

    await resumeService.uploadResume(
      user.userId,
      selectedFile
    );

    const updatedResumes =
      await resumeService.getMyResumes(
        user.userId
      );

    setResumes(updatedResumes);

    if (updatedResumes.length > 0) {
      const latestResume =
        updatedResumes[updatedResumes.length - 1];

      setSelectedResumeId(
        latestResume.resumeId
      );
    }

    setSelectedFile(null);

    const fileInput =
      document.getElementById(
        "job-application-resume"
      );

    if (fileInput) {
      fileInput.value = "";
    }

  } catch (error) {
    console.error(error);

    setResumeError(
      error.response?.data?.message ||
        error.response?.data ||
        "Failed to upload resume."
    );
  } finally {
    setUploadingResume(false);
  }
};

  const closeApplyModal = () => {
    if (applying) return;

    setShowApplyModal(false);
    setSelectedResumeId(null);
    setApplicationError("");
  };

  const handleApply = async () => {
    if (!selectedResumeId) {
      setApplicationError(
        "Please select a resume before applying."
      );
      return;
    }

    try {
      setApplying(true);
      setApplicationError("");

      const response =
        await applicationService.applyForJob(
          job.id,
          selectedResumeId
        );

      setSuccessMessage(
        response?.message ||
          "Your application has been submitted successfully."
      );
      setAlreadyApplied(true);
    } catch (err) {
      console.error(err);

      setApplicationError(
        err.response?.data?.message ||
          "Unable to submit your application."
      );
    } finally {
      setApplying(false);
    }
  };

  const getSkills = () => {
    if (!job?.requiredSkills) return [];

    return job.requiredSkills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  };

  if (loading) {
    return (
      <div className="job-details-page">
        <div className="job-details-loading">
          <div className="loader-spinner"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-details-page">
        <div className="job-details-error">
          <h2>Job Not Found</h2>
          <p>{error || "This job is no longer available."}</p>

          <button
            className="secondary-btn"
            onClick={() => navigate("/candidate/jobs")}
          >
            <ArrowLeft size={18} />
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const skills = getSkills();

  return (
    <div className="job-details-page">

      {/* Back */}
      <button
        className="back-to-jobs"
        onClick={() => navigate("/candidate/jobs")}
      >
        <ArrowLeft size={18} />
        Back to Jobs
      </button>

      {/* Header */}
      <section className="job-details-header">

        <div className="job-company-icon">
          <Building2 size={30} />
        </div>

        <div className="job-header-content">
          <div className="job-status-pill">
            <span></span>
            {job.status}
          </div>

          <h1>{job.title}</h1>

          <div className="job-header-meta">
            <span>
              <Briefcase size={17} />
              {job.employmentType || "Full Time"}
            </span>

            <span>
              <MapPin size={17} />
              {job.location || "Not specified"}
            </span>

            <span>
              <Clock3 size={17} />
              {job.workMode || "Not specified"}
            </span>
          </div>
        </div>

        <div className="job-header-action">
         <button
  className="apply-job-btn"
  onClick={openApplyModal}
  disabled={
    alreadyApplied ||
    checkingApplication
  }
>
  {alreadyApplied ? (
    <>
      <CheckCircle2 size={18} />
      Already Applied
    </>
  ) : (
    <>
      <Send size={18} />
      Apply Now
    </>
  )}
</button>
        </div>

      </section>

      {/* Main Content */}
      <div className="job-details-grid">

        {/* Left */}
        <main className="job-details-main">

          <section className="job-info-card">
            <div className="section-heading">
              <div className="section-icon">
                <FileText size={20} />
              </div>

              <div>
                <h2>Job Description</h2>
                <p>About this opportunity</p>
              </div>
            </div>

            <div className="job-description">
              {job.description ? (
                job.description
                  .split("\n")
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
              ) : (
                <p>
                  No job description has been provided.
                </p>
              )}
            </div>
          </section>

          {/* Required Skills */}
          <section className="job-info-card">

            <div className="section-heading">
              <div className="section-icon">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <h2>Required Skills</h2>
                <p>Skills expected for this position</p>
              </div>
            </div>

            <div className="skills-list">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span
                    className="job-skill"
                    key={index}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p>No specific skills listed.</p>
              )}
            </div>
          </section>

          {/* Preferred Skills */}
          {job.preferredSkills && (
            <section className="job-info-card">

              <div className="section-heading">
                <div className="section-icon">
                  <CheckCircle2 size={20} />
                </div>

                <div>
                  <h2>Preferred Skills</h2>
                  <p>Additional skills that may be beneficial</p>
                </div>
              </div>

              <div className="skills-list">
                {job.preferredSkills
                  .split(",")
                  .map((skill) => skill.trim())
                  .filter(Boolean)
                  .map((skill, index) => (
                    <span
                      className="job-skill preferred"
                      key={index}
                    >
                      {skill}
                    </span>
                  ))}
              </div>

            </section>
          )}

        </main>

        {/* Right */}
        <aside className="job-details-sidebar">

          <section className="job-summary-card">

            <h3>Job Overview</h3>

            <div className="job-summary-item">
              <Briefcase size={19} />
              <div>
                <span>Experience</span>
                <strong>
                  {job.experienceRequired ||
                    "Not specified"}
                </strong>
              </div>
            </div>

            <div className="job-summary-item">
              <MapPin size={19} />
              <div>
                <span>Location</span>
                <strong>
                  {job.location || "Not specified"}
                </strong>
              </div>
            </div>

            <div className="job-summary-item">
              <Clock3 size={19} />
              <div>
                <span>Work Mode</span>
                <strong>
                  {job.workMode || "Not specified"}
                </strong>
              </div>
            </div>

            <div className="job-summary-item">
              <CalendarDays size={19} />
              <div>
                <span>Employment</span>
                <strong>
                  {job.employmentType ||
                    "Not specified"}
                </strong>
              </div>
            </div>

          </section>

          <section className="apply-side-card">

            <div className="apply-side-icon">
              <Send size={22} />
            </div>

            <h3>Interested in this role?</h3>

            <p>
              Select your resume and submit your
              application in just a few steps.
            </p>

            <button
  className="apply-side-btn"
  onClick={openApplyModal}
  disabled={
    alreadyApplied ||
    checkingApplication
  }
>
  {alreadyApplied ? (
    <>
      Already Applied
      <CheckCircle2 size={17} />
    </>
  ) : (
    <>
      Apply Now
      <Send size={17} />
    </>
  )}
</button>

          </section>

        </aside>

      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div
          className="apply-modal-overlay"
          onClick={closeApplyModal}
        >

          <div
            className="apply-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="apply-modal-header">

              <div>
                <span className="modal-eyebrow">
                  Job Application
                </span>

                <h2>
                  Apply for {job.title}
                </h2>

                <p>
                  Select the resume you want to use
                  for this application.
                </p>
              </div>

              <button
                className="modal-close-btn"
                onClick={closeApplyModal}
                disabled={applying}
              >
                <X size={20} />
              </button>

            </div>

            {/* Success */}
            {successMessage ? (
              <div className="application-success">

                <div className="success-icon">
                  <CheckCircle2 size={30} />
                </div>

                <h3>Application Submitted</h3>

                <p>{successMessage}</p>

                <div className="success-actions">

                  <button
                    className="secondary-btn"
                    onClick={closeApplyModal}
                  >
                    Close
                  </button>

                  <button
                    className="primary-btn"
                    onClick={() =>
                      navigate(
                        "/candidate/applications"
                      )
                    }
                  >
                    View My Applications
                  </button>

                </div>

              </div>
            ) : (
              <>
                {resumeLoading ? (
                  <div className="resume-loading">
                    <div className="loader-spinner"></div>
                    <p>Loading your resumes...</p>
                  </div>
                ) : resumeError ? (
                  <div className="resume-error">
                    <p>{resumeError}</p>
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="no-resume-state">

  <div className="no-resume-icon">
    <Upload size={28} />
  </div>

  <h3>Upload Your Resume</h3>

  <p>
    You need to upload a resume before
    applying for this job.
  </p>

  <input
    id="job-application-resume"
    type="file"
    accept=".pdf,.docx"
    hidden
    onChange={handleResumeFileChange}
  />

  {!selectedFile ? (
    <label
      htmlFor="job-application-resume"
      className="primary-btn upload-from-device-btn"
    >
      <Upload size={17} />
      Choose Resume
    </label>
  ) : (
                    <div className="selected-upload-file">

                    <div className="selected-file-info">
                        <FileText size={20} />

                        <div>
                        <strong>
                            {selectedFile.name}
                        </strong>

                        <span>
                            Ready to upload
                        </span>
                        </div>
                    </div>

                    <button
                        className="primary-btn"
                        onClick={handleResumeUpload}
                        disabled={uploadingResume}
                    >
                        {uploadingResume ? (
                        <>
                            <span className="button-spinner"></span>
                            Uploading...
                        </>
                        ) : (
                        <>
                            <Upload size={17} />
                            Upload Resume
                        </>
                        )}
                    </button>

                    </div>
                )}

                {resumeError && (
                    <div className="application-error">
                    {resumeError}
                    </div>
                )}

                </div>
                ) : (
                  <>
                    <div className="resume-selection">

                      <label>
                        Select Resume
                      </label>

                      <div className="resume-options">

                        {resumes.map((resume) => (
                          <button
                            key={resume.resumeId}
                            className={`resume-option ${
                              selectedResumeId ===
                              resume.resumeId
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              setSelectedResumeId(
                                resume.resumeId
                              )
                            }
                          >

                            <div className="resume-file-icon">
                              <FileText size={21} />
                            </div>

                            <div className="resume-file-info">
                              <strong>
                                {resume.fileName}
                              </strong>

                              <span>
                                {resume.fileType ===
                                "application/pdf"
                                  ? "PDF Resume"
                                  : "DOCX Resume"}
                              </span>
                            </div>

                            <div className="resume-radio">
                              {selectedResumeId ===
                                resume.resumeId && (
                                <CheckCircle2 size={21} />
                              )}
                            </div>

                          </button>
                        ))}

                      </div>

                    </div>

                    {applicationError && (
                      <div className="application-error">
                        {applicationError}
                      </div>
                    )}

                    <div className="apply-modal-footer">

                      <button
                        className="secondary-btn"
                        onClick={closeApplyModal}
                        disabled={applying}
                      >
                        Cancel
                      </button>

                      <button
                        className="primary-btn"
                        onClick={handleApply}
                        disabled={
                          applying ||
                          !selectedResumeId
                        }
                      >
                        {applying ? (
                          <>
                            <span className="button-spinner"></span>
                            Applying...
                          </>
                        ) : (
                          <>
                            <Send size={17} />
                            Submit Application
                          </>
                        )}
                      </button>

                    </div>
                  </>
                )}
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;