import { useEffect, useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
} from "lucide-react";

import api from "../../services/api";
import resumeService from "../../services/resumeService";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoadingResumes(true);

      const data = await resumeService.getMyResumes(
        user.userId
      );

      setResumes(data);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load your resumes."
      );
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setSuccessMessage("");
    setErrorMessage("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setErrorMessage(
        "Only PDF and DOCX resume files are supported."
      );

      event.target.value = "";
      setFile(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setErrorMessage(
        "Resume file size must be less than 5 MB."
      );

      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Please select a resume first.");
      return;
    }

    try {
      setUploading(true);
      setSuccessMessage("");
      setErrorMessage("");

      const formData = new FormData();

      formData.append("candidateId", user.userId);
      formData.append("file", file);

      const response = await api.post(
        "/resumes/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage(
        response.data ||
          "Resume uploaded successfully."
      );

      setFile(null);

      const fileInput =
        document.getElementById("resume-upload");

      if (fileInput) {
        fileInput.value = "";
      }

      await fetchResumes();

    } catch (error) {
      console.error(error);

      setErrorMessage(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to upload resume."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="candidate-profile-page">

      {/* Page Header */}
      <div className="profile-page-header">
        <div>
          <span className="profile-eyebrow">
            Candidate Profile
          </span>

          <h1>My Profile</h1>

          <p>
            Manage your profile information and resumes.
          </p>
        </div>
      </div>

      {/* Profile Information */}
      <section className="profile-card">

        <div className="profile-card-header">
          <div className="profile-card-icon">
            <User size={21} />
          </div>

          <div>
            <h2>Personal Information</h2>
            <p>Your account information</p>
          </div>
        </div>

        <div className="profile-info-grid">

          <div className="profile-info-item">
            <div className="profile-info-icon">
              <User size={18} />
            </div>

            <div>
              <span>Full Name</span>
              <strong>
                {user?.fullName || "Not available"}
              </strong>
            </div>
          </div>

          <div className="profile-info-item">
            <div className="profile-info-icon">
              <Mail size={18} />
            </div>

            <div>
              <span>Email</span>
              <strong>
                {user?.email || "Not available"}
              </strong>
            </div>
          </div>

        </div>

      </section>

      {/* Resume Section */}
      <section className="profile-card resume-profile-card">

        <div className="profile-card-header">

          <div className="profile-card-icon">
            <FileText size={21} />
          </div>

          <div>
            <h2>My Resumes</h2>
            <p>
              Upload and manage resumes used for job applications.
            </p>
          </div>

        </div>

        {/* Messages */}
        {successMessage && (
          <div className="profile-success-message">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="profile-error-message">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Upload Area */}
        <div className="resume-upload-area">

          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            hidden
          />

          <label
            htmlFor="resume-upload"
            className="resume-upload-box"
          >

            <div className="resume-upload-icon">
              <Upload size={26} />
            </div>

            <div>
              <h3>
                {file
                  ? file.name
                  : "Upload your resume"}
              </h3>

              <p>
                {file
                  ? "Click to choose another file"
                  : "Drag and drop or click to browse"}
              </p>

              <span>
                PDF or DOCX • Maximum 5 MB
              </span>
            </div>

          </label>

          {file && (
            <button
              className="upload-resume-btn"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
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
          )}

        </div>

        {/* Existing Resumes */}
        <div className="existing-resumes">

          <div className="existing-resumes-title">
            <h3>Uploaded Resumes</h3>
            <span>
              {resumes.length}{" "}
              {resumes.length === 1
                ? "resume"
                : "resumes"}
            </span>
          </div>

          {loadingResumes ? (
            <div className="resume-list-loading">
              <div className="loader-spinner"></div>
              <p>Loading resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="empty-resumes">
              <FileText size={25} />
              <p>
                You haven't uploaded any resumes yet.
              </p>
            </div>
          ) : (
            <div className="resume-list">

              {resumes.map((resume) => (
                <div
                  className="uploaded-resume-item"
                  key={resume.resumeId}
                >

                  <div className="uploaded-resume-icon">
                    <FileText size={21} />
                  </div>

                  <div className="uploaded-resume-info">

                    <strong>
                      {resume.fileName}
                    </strong>

                    <span>
                      {resume.fileType ===
                      "application/pdf"
                        ? "PDF"
                        : "DOCX"}
                    </span>

                  </div>

                  <div className="resume-uploaded-status">
                    <CheckCircle2 size={17} />
                    Uploaded
                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </section>

    </div>
  );
};

export default Profile;