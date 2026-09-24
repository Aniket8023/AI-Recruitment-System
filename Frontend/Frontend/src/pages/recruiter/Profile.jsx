import { useEffect, useState } from "react";

import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Save,
  Pencil,
  X,
  CheckCircle2,
  AlertTriangle,
  BriefcaseBusiness,
  Users,
} from "lucide-react";

import {
  getMyCompany,
  createCompany,
  updateMyCompany,
} from "../../services/companyService";

import "./profile.css";


const initialForm = {
  companyName: "",
  companyEmail: "",
  companyWebsite: "",
  industry: "",
  companySize: "",
  description: "",
  address: "",
  city: "",
  state: "",
  country: "",
  logoUrl: "",
};


const Profile = () => {

  const [company, setCompany] = useState(null);

  const [formData, setFormData] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [isCreating, setIsCreating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =========================================================
  // LOAD COMPANY PROFILE
  // =========================================================

  const loadCompany = async () => {

    try {

      setLoading(true);
      setError("");
      setSuccess("");

      const data =
        await getMyCompany();

      setCompany(data);

      setFormData({
        companyName: data.companyName || "",
        companyEmail: data.companyEmail || "",
        companyWebsite: data.companyWebsite || "",
        industry: data.industry || "",
        companySize: data.companySize || "",
        description: data.description || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        logoUrl: data.logoUrl || "",
      });

      setIsCreating(false);

    } catch (err) {

      console.error(
        "Failed to load company profile:",
        err
      );

      /*
       * If company profile does not exist,
       * allow recruiter to create one.
       */

      if (err.response?.status === 400 ||
          err.response?.status === 404) {

        setCompany(null);
        setFormData(initialForm);
        setIsCreating(true);
        setEditing(true);

      } else {

        setError(
          err.response?.data?.message ||
          "Unable to load company profile."
        );

      }

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadCompany();

  }, []);


  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSave = async () => {

    try {

      setSaving(true);
      setError("");
      setSuccess("");

      let response;

      if (isCreating) {

        response =
          await createCompany(formData);

      } else {

        response =
          await updateMyCompany(formData);

      }

      setCompany(response);

      setFormData({
        companyName:
          response.companyName || "",

        companyEmail:
          response.companyEmail || "",

        companyWebsite:
          response.companyWebsite || "",

        industry:
          response.industry || "",

        companySize:
          response.companySize || "",

        description:
          response.description || "",

        address:
          response.address || "",

        city:
          response.city || "",

        state:
          response.state || "",

        country:
          response.country || "",

        logoUrl:
          response.logoUrl || "",
      });

      setIsCreating(false);
      setEditing(false);

      setSuccess(
        "Company profile saved successfully."
      );

    } catch (err) {

      console.error(
        "Failed to save company profile:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to save company profile."
      );

    } finally {

      setSaving(false);

    }
  };


  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancel = () => {

    if (isCreating) {
      return;
    }

    setFormData({
      companyName:
        company?.companyName || "",

      companyEmail:
        company?.companyEmail || "",

      companyWebsite:
        company?.companyWebsite || "",

      industry:
        company?.industry || "",

      companySize:
        company?.companySize || "",

      description:
        company?.description || "",

      address:
        company?.address || "",

      city:
        company?.city || "",

      state:
        company?.state || "",

      country:
        company?.country || "",

      logoUrl:
        company?.logoUrl || "",
    });

    setEditing(false);
    setError("");
    setSuccess("");
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <div className="profile-state">

        <div className="profile-spinner"></div>

        <p>
          Loading company profile...
        </p>

      </div>
    );
  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error && !editing) {

    return (
      <div className="profile-state profile-error">

        <AlertTriangle size={42} />

        <h3>
          Unable to load profile
        </h3>

        <p>
          {error}
        </p>

        <button
          onClick={loadCompany}
        >
          Try Again
        </button>

      </div>
    );
  }


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="recruiter-profile-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="profile-page-header">

        <div className="profile-title-area">

          <div className="profile-title-icon">
            <Building2 size={25} />
          </div>

          <div>

            <h1>
              Company Profile
            </h1>

            <p>
              Manage your company information
            </p>

          </div>

        </div>


        {!editing && company && (

          <button
            className="profile-edit-button"
            onClick={() => {
              setEditing(true);
              setError("");
              setSuccess("");
            }}
          >
            <Pencil size={17} />
            Edit Profile
          </button>

        )}

      </div>


      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {success && (

        <div className="profile-success-message">

          <CheckCircle2 size={18} />

          <span>
            {success}
          </span>

        </div>

      )}


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && editing && (

        <div className="profile-error-message">

          <AlertTriangle size={18} />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* =====================================================
          COMPANY HEADER CARD
      ===================================================== */}

      <section className="profile-company-card">

        <div className="profile-company-avatar">

          {formData.logoUrl ? (

            <img
              src={formData.logoUrl}
              alt={formData.companyName}
            />

          ) : (

            <Building2 size={30} />

          )}

        </div>


        <div className="profile-company-info">

          <h2>
            {formData.companyName ||
              "Company Name"}
          </h2>

          <span>
            {formData.industry ||
              "Industry not specified"}
          </span>

          {formData.companyEmail && (

            <div className="profile-company-email">

              <Mail size={15} />

              {formData.companyEmail}

            </div>

          )}

        </div>


        {company?.verified && (

          <div className="profile-verified">

            <CheckCircle2 size={16} />

            Verified

          </div>

        )}

      </section>


      {/* =====================================================
          COMPANY INFORMATION
      ===================================================== */}

      <section className="profile-card">

        <div className="profile-card-heading">

          <div>

            <h2>
              Company Information
            </h2>

            <p>
              Basic information about your organization
            </p>

          </div>

        </div>


        <div className="profile-form-grid">

          {/* COMPANY NAME */}

          <div className="profile-field">

            <label>
              Company Name
            </label>

            {editing ? (

              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
              />

            ) : (

              <div className="profile-readonly">
                <Building2 size={17} />
                {formData.companyName || "Not provided"}
              </div>

            )}

          </div>


          {/* COMPANY EMAIL */}

          <div className="profile-field">

            <label>
              Company Email
            </label>

            {editing ? (

              <input
                type="email"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                placeholder="company@example.com"
              />

            ) : (

              <div className="profile-readonly">
                <Mail size={17} />
                {formData.companyEmail || "Not provided"}
              </div>

            )}

          </div>


          {/* WEBSITE */}

          <div className="profile-field">

            <label>
              Company Website
            </label>

            {editing ? (

              <input
                type="text"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                placeholder="https://example.com"
              />

            ) : (

              <div className="profile-readonly">
                <Globe size={17} />

                {formData.companyWebsite ||
                  "Not provided"}

              </div>

            )}

          </div>


          {/* INDUSTRY */}

          <div className="profile-field">

            <label>
              Industry
            </label>

            {editing ? (

              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. Information Technology"
              />

            ) : (

              <div className="profile-readonly">
                <BriefcaseBusiness size={17} />

                {formData.industry ||
                  "Not provided"}

              </div>

            )}

          </div>


          {/* COMPANY SIZE */}

          <div className="profile-field">

            <label>
              Company Size
            </label>

            {editing ? (

              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
              >

                <option value="">
                  Select company size
                </option>

                <option value="1-10">
                  1-10 employees
                </option>

                <option value="11-50">
                  11-50 employees
                </option>

                <option value="51-200">
                  51-200 employees
                </option>

                <option value="201-500">
                  201-500 employees
                </option>

                <option value="501-1000">
                  501-1000 employees
                </option>

                <option value="1000+">
                  1000+ employees
                </option>

              </select>

            ) : (

              <div className="profile-readonly">
                <Users size={17} />

                {formData.companySize ||
                  "Not provided"}

              </div>

            )}

          </div>


          {/* LOGO URL */}

          <div className="profile-field">

            <label>
              Logo URL
            </label>

            {editing ? (

              <input
                type="text"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://..."
              />

            ) : (

              <div className="profile-readonly">
                <Globe size={17} />

                {formData.logoUrl ||
                  "Not provided"}

              </div>

            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          LOCATION
      ===================================================== */}

      <section className="profile-card">

        <div className="profile-card-heading">

          <div>

            <h2>
              Company Location
            </h2>

            <p>
              Where your organization is located
            </p>

          </div>

        </div>


        <div className="profile-form-grid">

          <div className="profile-field">

            <label>
              Address
            </label>

            {editing ? (

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
              />

            ) : (

              <div className="profile-readonly">
                <MapPin size={17} />

                {formData.address ||
                  "Not provided"}

              </div>

            )}

          </div>


          <div className="profile-field">

            <label>
              City
            </label>

            {editing ? (

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />

            ) : (

              <div className="profile-readonly">
                <MapPin size={17} />

                {formData.city ||
                  "Not provided"}

              </div>

            )}

          </div>


          <div className="profile-field">

            <label>
              State
            </label>

            {editing ? (

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
              />

            ) : (

              <div className="profile-readonly">
                {formData.state ||
                  "Not provided"}
              </div>

            )}

          </div>


          <div className="profile-field">

            <label>
              Country
            </label>

            {editing ? (

              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
              />

            ) : (

              <div className="profile-readonly">
                {formData.country ||
                  "Not provided"}
              </div>

            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <section className="profile-card">

        <div className="profile-card-heading">

          <div>

            <h2>
              About Company
            </h2>

            <p>
              Tell candidates about your organization
            </p>

          </div>

        </div>


        <div className="profile-field">

          {editing ? (

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a short description about your company..."
              rows={6}
            />

          ) : (

            <div className="profile-description">

              {formData.description ||
                "No company description has been added yet."}

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          ACTIONS
      ===================================================== */}

      {editing && (

        <div className="profile-actions">

          {!isCreating && (

            <button
              className="profile-cancel-button"
              onClick={handleCancel}
              disabled={saving}
            >
              <X size={17} />
              Cancel
            </button>

          )}

          <button
            className="profile-save-button"
            onClick={handleSave}
            disabled={saving}
          >

            {saving ? (

              <>
                <span className="profile-button-spinner"></span>
                Saving...
              </>

            ) : (

              <>
                <Save size={17} />
                {isCreating
                  ? "Create Profile"
                  : "Save Changes"}
              </>

            )}

          </button>

        </div>

      )}

    </div>
  );
};

export default Profile;