import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  Clock3,
  ArrowUpRight,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import jobService from "../../services/jobService";

const Jobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await jobService.getPublishedJobs();

        setJobs(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load jobs."
        );
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        !search ||
        job.title?.toLowerCase().includes(searchText) ||
        job.description
          ?.toLowerCase()
          .includes(searchText) ||
        job.requiredSkills
          ?.toLowerCase()
          .includes(searchText);

      const matchesLocation =
        !location ||
        job.location
          ?.toLowerCase()
          .includes(location.toLowerCase());

      const matchesWorkMode =
        !workMode ||
        job.workMode === workMode;

      const matchesEmployment =
        !employmentType ||
        job.employmentType === employmentType;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesWorkMode &&
        matchesEmployment
      );
    });
  }, [
    jobs,
    search,
    location,
    workMode,
    employmentType,
  ]);

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setWorkMode("");
    setEmploymentType("");
  };

  return (
    <div className="jobs-page">

      {/* =========================
          HERO
      ========================= */}

      <section className="jobs-hero">

        <div className="jobs-hero-content">

          <div className="jobs-badge">
            <Sparkles size={13} />
            AI-powered opportunities
          </div>

          <h2>
            Find work that
            <span> fits you.</span>
          </h2>

          <p>
            Explore opportunities matched with your
            skills, experience and career goals.
          </p>

        </div>

      </section>


      {/* =========================
          SEARCH
      ========================= */}

      <section className="jobs-search-card">

        <div className="jobs-search-main">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by job title, skill or keyword..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="jobs-location-input">

          <MapPin size={17} />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          />

        </div>

        <select
          value={workMode}
          onChange={(e) =>
            setWorkMode(e.target.value)
          }
        >
          <option value="">Work mode</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>

        <select
          value={employmentType}
          onChange={(e) =>
            setEmploymentType(e.target.value)
          }
        >
          <option value="">Employment</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

      </section>


      {/* =========================
          HEADER
      ========================= */}

      <div className="jobs-results-header">

        <div>
          <h3>
            Available opportunities
          </h3>

          <p>
            {filteredJobs.length} jobs found
          </p>
        </div>

        {(search ||
          location ||
          workMode ||
          employmentType) && (
          <button
            className="clear-filter-button"
            onClick={clearFilters}
          >
            <X size={14} />
            Clear filters
          </button>
        )}

      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="jobs-error">
          {error}
        </div>
      )}


      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className="jobs-loading">
          <div className="jobs-spinner"></div>
          <p>Finding opportunities...</p>
        </div>
      )}


      {/* =========================
          EMPTY
      ========================= */}

      {!loading &&
        !error &&
        filteredJobs.length === 0 && (
          <div className="jobs-empty">

            <div className="jobs-empty-icon">
              <BriefcaseBusiness size={25} />
            </div>

            <h3>
              No jobs found
            </h3>

            <p>
              Try changing your search or filters.
            </p>

            <button
              onClick={clearFilters}
            >
              Clear filters
            </button>

          </div>
        )}


      {/* =========================
          JOB LIST
      ========================= */}

      {!loading &&
        filteredJobs.length > 0 && (
          <div className="jobs-grid">

            {filteredJobs.map((job) => {

              const skills =
                job.requiredSkills
                  ?.split(",")
                  .map((skill) => skill.trim())
                  .filter(Boolean)
                  .slice(0, 5) || [];

              return (
                <article
                  className="job-card"
                  key={job.id}
                >

                  <div className="job-card-top">

                    <div className="job-logo">
                      <BriefcaseBusiness
                        size={19}
                      />
                    </div>

                    <span className="published-badge">
                      <span></span>
                      Published
                    </span>

                  </div>


                  <div className="job-card-content">

                    <h3>
                      {job.title}
                    </h3>

                    <p className="job-description">
                      {job.description}
                    </p>

                    <div className="job-details">

                      {job.location && (
                        <span>
                          <MapPin size={14} />
                          {job.location}
                        </span>
                      )}

                      {job.workMode && (
                        <span>
                          <Clock3 size={14} />
                          {job.workMode}
                        </span>
                      )}

                      {job.employmentType && (
                        <span>
                          <BriefcaseBusiness
                            size={14}
                          />
                          {job.employmentType}
                        </span>
                      )}

                    </div>


                    {skills.length > 0 && (
                      <div className="job-skills">

                        {skills.map((skill) => (
                          <span key={skill}>
                            {skill}
                          </span>
                        ))}

                      </div>
                    )}

                  </div>


                  <div className="job-card-bottom">

                    <div className="job-experience">

                      <span>
                        Experience
                      </span>

                      <strong>
                        {job.experienceRequired ||
                          "Not specified"}
                      </strong>

                    </div>

                    <button
                      className="view-job-button"
                      onClick={() =>
                        navigate(
                          `/candidate/jobs/${job.id}`
                        )
                      }
                    >
                      View details
                      <ArrowUpRight
                        size={15}
                      />
                    </button>

                  </div>

                </article>
              );
            })}

          </div>
        )}

    </div>
  );
};

export default Jobs;