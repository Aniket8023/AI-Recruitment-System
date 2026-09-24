import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  MapPin,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import { getRecruiterCandidates } from "../../services/recruiterCandidateService";
import "./recruiterCandidates.css";

const RecruiterCandidates = () => {

  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRecruiterCandidates();

      setCandidates(data || []);
    } catch (err) {
      console.error("Failed to load candidates:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load candidates."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const filteredCandidates = useMemo(() => {

    const searchValue = search
      .trim()
      .toLowerCase();

    return candidates.filter((candidate) => {

      const matchesSearch =
        !searchValue ||
        candidate.candidateName
          ?.toLowerCase()
          .includes(searchValue) ||
        candidate.candidateEmail
          ?.toLowerCase()
          .includes(searchValue) ||
        candidate.jobTitle
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        candidate.applicationStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });

  }, [candidates, search, statusFilter]);

  const getStatusClass = (status) => {

    switch (status) {

      case "MATCHED":
        return "candidate-status matched";

      case "ASSESSMENT_PENDING":
        return "candidate-status assessment";

      case "INTERVIEW_PENDING":
        return "candidate-status interview";

     case "SHORTLISTED":
  return "candidate-status selected";

      case "REJECTED":
        return "candidate-status rejected";

      default:
        return "candidate-status";
    }
  };

  if (loading) {
    return (
      <div className="recruiter-candidates-state">
        <div className="candidates-spinner"></div>
        <p>Loading candidates...</p>
      </div>
    );
  }

  return (
    <div className="recruiter-candidates-page">

      {/* HEADER */}

      <div className="candidates-page-header">

        <div>

          <div className="candidates-title-row">

            <div className="candidates-title-icon">
              <Users size={23} />
            </div>

            <div>
              <h1>Candidates</h1>

              <p>
                Manage candidates who applied to your jobs.
              </p>
            </div>

          </div>

        </div>

        <button
          className="refresh-candidates-button"
          onClick={loadCandidates}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      {/* STATS */}

      <div className="candidate-summary">

        <div className="candidate-summary-card">
          <span>Total Candidates</span>
          <strong>{candidates.length}</strong>
        </div>

       <div className="candidate-summary-card">
        <span>Matched</span>
        <strong>
          {
            candidates.filter(
              (candidate) =>
                candidate.matchScore !== null &&
                candidate.matchScore !== undefined
            ).length
          }
        </strong>
      </div>

       <div className="candidate-summary-card">
        <span>Selected</span>
        <strong>
          {
            candidates.filter(
              (candidate) =>
                candidate.applicationStatus === "SHORTLISTED"
            ).length
          }
        </strong>
      </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="candidates-error">
          {error}
        </div>
      )}

      {/* FILTERS */}

      <div className="candidate-filter-card">

        <div className="candidate-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search candidate, email or job..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="ALL">
            All Status
          </option>

          <option value="APPLIED">
            Applied
          </option>

          <option value="MATCHED">
            Matched
          </option>

          <option value="ASSESSMENT_PENDING">
            Assessment Pending
          </option>

          <option value="SELECTED">
            Selected
          </option>

          <option value="REJECTED">
            Rejected
          </option>
        </select>

      </div>

      {/* TABLE */}

      <div className="candidate-table-card">

        {filteredCandidates.length === 0 ? (

          <div className="empty-candidates">

            <Users size={42} />

            <h3>No candidates found</h3>

            <p>
              Candidates matching your filters will
              appear here.
            </p>

          </div>

        ) : (

          <div className="candidate-table-wrapper">

            <table className="candidate-table">

              <thead>
                <tr>
                  <th>CANDIDATE</th>
                  <th>JOB</th>
                  <th>STATUS</th>
                  <th>AI MATCH</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>

                {filteredCandidates.map(
                  (candidate) => (

                    <tr key={candidate.applicationId}>

                      <td>

                        <div className="candidate-info">

                          <div className="candidate-avatar">
                            {candidate.candidateName
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {candidate.candidateName}
                            </strong>

                            <span>
                              {candidate.candidateEmail}
                            </span>
                          </div>

                        </div>

                      </td>

                      <td>

                        <div className="candidate-job">

                          <strong>
                            {candidate.jobTitle}
                          </strong>

                        </div>

                      </td>

                      <td>

                        <span
                          className={getStatusClass(
                            candidate.applicationStatus
                          )}
                        >
                          {candidate.applicationStatus
                            ?.replaceAll("_", " ")}
                        </span>

                      </td>

                      <td>

                        {candidate.matchScore !== null &&
                        candidate.matchScore !== undefined ? (
                          <div className="match-score">

                            <strong>
                              {candidate.matchScore.toFixed(1)}
                            </strong>

                            <span>/ 10</span>

                          </div>
                        ) : (
                          <span className="not-available">
                            Not evaluated
                          </span>
                        )}

                      </td>

                      <td>

                        <button
                          className="candidate-view-button"
                          onClick={() =>
                            navigate(
                              `/recruiter/candidates/${candidate.candidateId}/applications/${candidate.applicationId}`
                            )
                          }
                        >
                          View
                          <ChevronRight size={16} />
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default RecruiterCandidates;