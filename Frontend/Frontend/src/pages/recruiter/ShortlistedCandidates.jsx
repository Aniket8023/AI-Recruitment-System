import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  Search,
  RefreshCw,
  Eye,
  BriefcaseBusiness,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import {
  getRecruiterCandidates,
} from "../../services/recruiterCandidateService";

import "./shortlistedCandidates.css";


const ShortlistedCandidates = () => {

  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");


  // =========================================================
  // LOAD SHORTLISTED CANDIDATES
  // =========================================================

  const loadShortlistedCandidates = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await getRecruiterCandidates();

      const shortlisted = (data || []).filter(
        (candidate) =>
          candidate.applicationStatus === "SHORTLISTED"
      );

      setCandidates(shortlisted);

    } catch (err) {

      console.error(
        "Failed to load shortlisted candidates:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load shortlisted candidates."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    loadShortlistedCandidates();

  }, []);


  // =========================================================
  // SEARCH
  // =========================================================

  const filteredCandidates = useMemo(() => {

    const search = searchTerm
      .trim()
      .toLowerCase();

    if (!search) {
      return candidates;
    }

    return candidates.filter((candidate) => {

      const candidateName =
        candidate.candidateName?.toLowerCase() || "";

      const candidateEmail =
        candidate.candidateEmail?.toLowerCase() || "";

      const jobTitle =
        candidate.jobTitle?.toLowerCase() || "";

      return (
        candidateName.includes(search) ||
        candidateEmail.includes(search) ||
        jobTitle.includes(search)
      );

    });

  }, [candidates, searchTerm]);


  // =========================================================
  // VIEW CANDIDATE
  // =========================================================

  const handleViewCandidate = (applicationId) => {

    navigate(
      `/recruiter/candidates/${applicationId}`
    );

  };


  // =========================================================
  // FORMAT SCORE
  // =========================================================

  const formatMatchScore = (score) => {

    if (
      score === null ||
      score === undefined
    ) {
      return null;
    }

    return Number(score).toFixed(1);

  };


  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {

    return (
      <div className="shortlisted-state">

        <div className="shortlisted-spinner"></div>

        <p>
          Loading shortlisted candidates...
        </p>

      </div>
    );

  }


  // =========================================================
  // ERROR STATE
  // =========================================================

  if (error) {

    return (
      <div className="shortlisted-state error">

        <AlertTriangle size={42} />

        <h3>
          Unable to load shortlisted candidates
        </h3>

        <p>
          {error}
        </p>

        <button
          onClick={loadShortlistedCandidates}
        >
          <RefreshCw size={17} />
          Try Again
        </button>

      </div>
    );

  }


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="shortlisted-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="shortlisted-page-header">

        <div className="shortlisted-heading">

          <div className="shortlisted-heading-icon">
            <Users size={24} />
          </div>

          <div>

            <h1>
              Shortlisted Candidates
            </h1>

            <p>
              Candidates selected for further recruitment
            </p>

          </div>

        </div>


        <button
          className="shortlisted-refresh-button"
          onClick={loadShortlistedCandidates}
          disabled={loading}
        >

          <RefreshCw
            size={17}
            className={
              loading
                ? "refresh-spinning"
                : ""
            }
          />

          Refresh

        </button>

      </div>


      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="shortlisted-summary-card">

        <div className="shortlisted-summary-icon">
          <CheckCircle2 size={23} />
        </div>

        <div>

          <span>
            Total Shortlisted
          </span>

          <strong>
            {candidates.length}
          </strong>

        </div>

      </div>


      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="shortlisted-toolbar">

        <div className="shortlisted-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search candidate, email or job..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>

      </div>


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {filteredCandidates.length === 0 ? (

        <div className="shortlisted-empty">

          <div className="shortlisted-empty-icon">
            <Users size={32} />
          </div>

          <h3>
            {searchTerm
              ? "No candidates found"
              : "No shortlisted candidates"}
          </h3>

          <p>

            {searchTerm
              ? "Try a different search term."
              : "Candidates you shortlist will appear here."}

          </p>

        </div>

      ) : (

        /* ===================================================
           CANDIDATES TABLE
           =================================================== */

        <div className="shortlisted-table-wrapper">

          <table className="shortlisted-table">

            <thead>

              <tr>

                <th>
                  CANDIDATE
                </th>

                <th>
                  JOB
                </th>

                <th>
                  AI MATCH
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

              {filteredCandidates.map(
                (candidate) => (

                  <tr
                    key={candidate.applicationId}
                  >

                    {/* CANDIDATE */}

                    <td>

                      <div className="shortlisted-candidate">

                        <div className="shortlisted-avatar">

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


                    {/* JOB */}

                    <td>

                      <div className="shortlisted-job">

                        <BriefcaseBusiness size={16} />

                        <span>
                          {candidate.jobTitle}
                        </span>

                      </div>

                    </td>


                    {/* AI MATCH */}

                    <td>

                      {formatMatchScore(
                        candidate.matchScore
                      ) !== null ? (

                        <div className="shortlisted-match-score">

                          <strong>
                            {formatMatchScore(
                              candidate.matchScore
                            )}
                          </strong>

                          <span>
                            / 100
                          </span>

                        </div>

                      ) : (

                        <span className="shortlisted-not-evaluated">
                          Not evaluated
                        </span>

                      )}

                    </td>


                    {/* STATUS */}

                    <td>

                      <span className="shortlisted-status">

                        <CheckCircle2 size={14} />

                        Shortlisted

                      </span>

                    </td>


                    {/* ACTION */}

                    <td>

                      <button
                        className="shortlisted-view-button"
                        onClick={() =>
                          handleViewCandidate(
                            candidate.applicationId
                          )
                        }
                      >

                        View

                        <Eye size={16} />

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

  );

};


export default ShortlistedCandidates;