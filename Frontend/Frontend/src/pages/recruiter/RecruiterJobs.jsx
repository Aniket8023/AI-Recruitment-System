import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Pencil,
  Globe,
  LockKeyhole,
  Archive,
  Loader2,
  AlertCircle,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import "./recruiterJobs.css";

const RecruiterJobs = () => {

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [actionJobId, setActionJobId] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);


  // =========================================================
  // LOAD JOBS
  // =========================================================

  const loadJobs = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await api.get("/jobs/my");

      setJobs(response.data || []);

    } catch (error) {

      console.error(
        "Failed to load recruiter jobs:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load your jobs."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadJobs();

  }, []);


  // =========================================================
  // FILTER JOBS
  // =========================================================

  const filteredJobs = useMemo(() => {

    return jobs.filter((job) => {

      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        job.title
          ?.toLowerCase()
          .includes(searchText) ||
        job.location
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "ALL" ||
        job.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );

    });

  }, [jobs, search, statusFilter]);


  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (status) => {

    switch (status) {

      case "PUBLISHED":
        return "recruiter-job-status-published";

      case "DRAFT":
        return "recruiter-job-status-draft";

      case "CLOSED":
        return "recruiter-job-status-closed";

      case "ARCHIVED":
        return "recruiter-job-status-archived";

      default:
        return "";

    }

  };


  // =========================================================
  // JOB ACTION
  // =========================================================

  const handleAction = async (
    jobId,
    action
  ) => {

    try {

      setActionLoading(true);
      setError("");

      let endpoint = "";

      switch (action) {

        case "publish":
          endpoint =
            `/jobs/${jobId}/publish`;
          break;

        case "close":
          endpoint =
            `/jobs/${jobId}/close`;
          break;

        case "archive":
          endpoint =
            `/jobs/${jobId}/archive`;
          break;

        default:
          return;

      }


      const response =
        await api.patch(endpoint);


      setJobs((previousJobs) =>
        previousJobs.map((job) =>
          job.id === jobId
            ? response.data
            : job
        )
      );

      setActionJobId(null);

    } catch (error) {

      console.error(
        "Job action failed:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to update job."
      );

    } finally {

      setActionLoading(false);

    }

  };


  // =========================================================
  // CREATE JOB
  // =========================================================

  const handleCreateJob = () => {

    navigate(
      "/recruiter/jobs/create"
    );

  };


  // =========================================================
  // VIEW JOB
  // =========================================================

  const handleViewJob = (jobId) => {

    navigate(
      `/recruiter/jobs/${jobId}`
    );

  };


  // =========================================================
  // EDIT JOB
  // =========================================================

  const handleEditJob = (jobId) => {

    navigate(
      `/recruiter/jobs/${jobId}/edit`
    );

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="recruiter-jobs-page">

        <div className="recruiter-jobs-loading">

          <Loader2 size={28} />

          <h3>
            Loading your jobs
          </h3>

          <p>
            Fetching your job postings...
          </p>

        </div>

      </div>

    );

  }


  return (

    <div className="recruiter-jobs-page">


      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="recruiter-jobs-header">

        <div>

          <span className="recruiter-jobs-eyebrow">
            JOB MANAGEMENT
          </span>

          <h1>
            My Jobs
          </h1>

          <p>
            Create, manage and monitor your job postings.
          </p>

        </div>


        <button
          className="recruiter-create-job-btn"
          onClick={handleCreateJob}
        >

          <Plus size={18} />

          Create Job

        </button>

      </div>



      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (

        <div className="recruiter-jobs-error">

          <AlertCircle size={17} />

          <span>
            {error}
          </span>

        </div>

      )}



      {/* =====================================================
          SUMMARY
          ===================================================== */}

      <div className="recruiter-jobs-summary">

        <div>

          <strong>
            {jobs.length}
          </strong>

          <span>
            Total Jobs
          </span>

        </div>


        <div>

          <strong>
            {
              jobs.filter(
                (job) =>
                  job.status === "PUBLISHED"
              ).length
            }
          </strong>

          <span>
            Published
          </span>

        </div>


        <div>

          <strong>
            {
              jobs.filter(
                (job) =>
                  job.status === "DRAFT"
              ).length
            }
          </strong>

          <span>
            Drafts
          </span>

        </div>


        <div>

          <strong>
            {
              jobs.filter(
                (job) =>
                  job.status === "CLOSED"
              ).length
            }
          </strong>

          <span>
            Closed
          </span>

        </div>

      </div>



      {/* =====================================================
          FILTERS
          ===================================================== */}

      <div className="recruiter-jobs-toolbar">


        <div className="recruiter-job-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search jobs by title or location..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>


        <div className="recruiter-status-filter">

          <ChevronDown size={15} />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >

            <option value="ALL">
              All Status
            </option>

            <option value="PUBLISHED">
              Published
            </option>

            <option value="DRAFT">
              Draft
            </option>

            <option value="CLOSED">
              Closed
            </option>

            <option value="ARCHIVED">
              Archived
            </option>

          </select>

        </div>

      </div>



      {/* =====================================================
          EMPTY
          ===================================================== */}

      {filteredJobs.length === 0 ? (

        <div className="recruiter-jobs-empty">

          <div className="recruiter-jobs-empty-icon">

            <BriefcaseBusiness size={28} />

          </div>


          <h3>

            {jobs.length === 0
              ? "No jobs created yet"
              : "No matching jobs"}

          </h3>


          <p>

            {jobs.length === 0
              ? "Create your first job posting to start hiring."
              : "Try changing your search or status filter."}

          </p>


          {jobs.length === 0 && (

            <button
              className="recruiter-create-job-btn"
              onClick={handleCreateJob}
            >

              <Plus size={17} />

              Create Job

            </button>

          )}

        </div>

      ) : (


        /* ===================================================
           JOB TABLE
           =================================================== */

        <div className="recruiter-jobs-table-card">

          <div className="recruiter-jobs-table-wrapper">

            <table className="recruiter-jobs-table">

              <thead>

                <tr>

                  <th>
                    JOB
                  </th>

                  <th>
                    LOCATION
                  </th>

                  <th>
                    TYPE
                  </th>

                  <th>
                    WORK MODE
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    ACTION
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredJobs.map((job) => (

                  <tr key={job.id}>


                    {/* JOB */}

                    <td>

                      <div className="recruiter-table-job">

                        <div className="recruiter-table-job-icon">

                          <BriefcaseBusiness
                            size={17}
                          />

                        </div>


                        <div>

                          <strong>
                            {job.title}
                          </strong>

                          <span>
                            Job ID #{job.id}
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* LOCATION */}

                    <td>

                      <span className="recruiter-table-location">

                        <MapPin size={13} />

                        {job.location ||
                          "Not specified"}

                      </span>

                    </td>


                    {/* EMPLOYMENT TYPE */}

                    <td>

                      <span className="recruiter-table-text">

                        {job.employmentType ||
                          "Not specified"}

                      </span>

                    </td>


                    {/* WORK MODE */}

                    <td>

                      <span className="recruiter-table-text">

                        {job.workMode ||
                          "Not specified"}

                      </span>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`recruiter-job-status ${getStatusClass(
                          job.status
                        )}`}
                      >

                        {job.status}

                      </span>

                    </td>


                    {/* ACTION */}

                    <td>

                      <div className="recruiter-job-actions">


                        <button
                          title="View"
                          onClick={() =>
                            handleViewJob(
                              job.id
                            )
                          }
                        >

                          <Eye size={16} />

                        </button>


                        {(job.status === "DRAFT" ||
                          job.status === "PUBLISHED") && (

                          <button
                            title="Edit"
                            onClick={() =>
                              handleEditJob(
                                job.id
                              )
                            }
                          >

                            <Pencil size={16} />

                          </button>

                        )}


                        <button
                          title="More actions"
                          onClick={() =>
                            setActionJobId(
                              actionJobId === job.id
                                ? null
                                : job.id
                            )
                          }
                        >

                          <MoreVertical size={17} />

                        </button>


                        {actionJobId === job.id && (

                          <div className="recruiter-job-action-menu">


                            {job.status === "DRAFT" && (

                              <button
                                onClick={() =>
                                  handleAction(
                                    job.id,
                                    "publish"
                                  )
                                }
                                disabled={actionLoading}
                              >

                                <Globe size={14} />

                                Publish Job

                              </button>

                            )}


                            {job.status === "PUBLISHED" && (

                              <button
                                onClick={() =>
                                  handleAction(
                                    job.id,
                                    "close"
                                  )
                                }
                                disabled={actionLoading}
                              >

                                <LockKeyhole size={14} />

                                Close Job

                              </button>

                            )}


                            {job.status === "CLOSED" && (

                              <button
                                onClick={() =>
                                  handleAction(
                                    job.id,
                                    "archive"
                                  )
                                }
                                disabled={actionLoading}
                              >

                                <Archive size={14} />

                                Archive Job

                              </button>

                            )}

                          </div>

                        )}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>

  );

};

export default RecruiterJobs;