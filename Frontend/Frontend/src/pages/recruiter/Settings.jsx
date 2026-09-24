import { useEffect, useState } from "react";
import {
  User,
  Lock,
  Bell,
  ShieldCheck,
  Save,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import userService from "../../services/userService";
import "./settings.css";

const Settings = () => {
  const [profile, setProfile] = useState(null);

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    profileImageUrl: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [notifications, setNotifications] = useState({
    newApplications: true,
    assessmentCompleted: true,
    interviewCompleted: true,
    shortlisted: true,
    emailNotifications: true,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const data = await userService.getMyProfile();

      setProfile(data);

      setProfileForm({
        fullName: data.fullName || "",
        phone: data.phone || "",
        profileImageUrl: data.profileImageUrl || "",
      });
    } catch (error) {
      console.error("Failed to load user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      setSavingProfile(true);
      setProfileMessage("");

      const updated =
        await userService.updateMyProfile(profileForm);

      setProfile(updated);

      setProfileMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error
      );

      setProfileMessage(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordMessage("");

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setPasswordMessage(
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);

      await userService.changePassword(passwordForm);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordMessage(
        "Password changed successfully."
      );
    } catch (error) {
      console.error(
        "Failed to change password:",
        error
      );

      setPasswordMessage(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleNotificationChange = (name) => {
    setNotifications((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <Loader2 className="spin" size={28} />
        <span>Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="settings-page">

      {/* HEADER */}

      <div className="settings-header">
        <div>
          <h1>Settings</h1>

          <p>
            Manage your account, security and
            notification preferences.
          </p>
        </div>
      </div>


      {/* ACCOUNT INFORMATION */}

      <section className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">
            <User size={20} />
          </div>

          <div>
            <h2>Account Information</h2>
            <p>
              Update your personal account information.
            </p>
          </div>

        </div>


        <form onSubmit={handleSaveProfile}>

          <div className="settings-grid">

            <div className="settings-field">
              <label>Full Name</label>

              <input
                type="text"
                name="fullName"
                value={profileForm.fullName}
                onChange={handleProfileChange}
                placeholder="Enter your full name"
              />
            </div>


            <div className="settings-field">

              <label>Email Address</label>

              <input
                type="email"
                value={profile?.email || ""}
                disabled
              />

              <small>
                Email address cannot be changed here.
              </small>

            </div>


            <div className="settings-field">

              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                placeholder="Enter phone number"
              />

            </div>


            <div className="settings-field">

              <label>Role</label>

              <input
                type="text"
                value={
                  profile?.role
                    ?.replace("_", " ") || ""
                }
                disabled
              />

            </div>

          </div>


          {profileMessage && (
            <div className="settings-message">
              {profileMessage}
            </div>
          )}


          <button
            type="submit"
            className="settings-primary-btn"
            disabled={savingProfile}
          >
            {savingProfile ? (
              <>
                <Loader2
                  size={17}
                  className="spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Changes
              </>
            )}
          </button>

        </form>

      </section>


      {/* PASSWORD */}

      <section className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">
            <Lock size={20} />
          </div>

          <div>
            <h2>Change Password</h2>

            <p>
              Keep your account secure with a strong
              password.
            </p>
          </div>

        </div>


        <form onSubmit={handleChangePassword}>

          <div className="settings-grid">

            <PasswordInput
              label="Current Password"
              name="currentPassword"
              value={
                passwordForm.currentPassword
              }
              onChange={handlePasswordChange}
              show={showCurrentPassword}
              setShow={setShowCurrentPassword}
            />


            <PasswordInput
              label="New Password"
              name="newPassword"
              value={
                passwordForm.newPassword
              }
              onChange={handlePasswordChange}
              show={showNewPassword}
              setShow={setShowNewPassword}
            />


            <PasswordInput
              label="Confirm New Password"
              name="confirmPassword"
              value={
                passwordForm.confirmPassword
              }
              onChange={handlePasswordChange}
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
            />

          </div>


          {passwordMessage && (
            <div className="settings-message">
              {passwordMessage}
            </div>
          )}


          <button
            type="submit"
            className="settings-primary-btn"
            disabled={changingPassword}
          >
            {changingPassword ? (
              <>
                <Loader2
                  size={17}
                  className="spin"
                />
                Updating...
              </>
            ) : (
              <>
                <Lock size={17} />
                Change Password
              </>
            )}
          </button>

        </form>

      </section>


      {/* NOTIFICATIONS */}

      <section className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">
            <Bell size={20} />
          </div>

          <div>
            <h2>Notifications</h2>

            <p>
              Choose which recruiter notifications
              you want to receive.
            </p>
          </div>

        </div>


        <div className="notification-list">

          <NotificationToggle
            label="New Applications"
            description="Get notified when candidates apply for your jobs."
            checked={notifications.newApplications}
            onChange={() =>
              handleNotificationChange(
                "newApplications"
              )
            }
          />

          <NotificationToggle
            label="Assessment Completed"
            description="Get notified when a candidate completes an assessment."
            checked={notifications.assessmentCompleted}
            onChange={() =>
              handleNotificationChange(
                "assessmentCompleted"
              )
            }
          />

          <NotificationToggle
            label="Interview Completed"
            description="Get notified when a candidate completes an interview."
            checked={notifications.interviewCompleted}
            onChange={() =>
              handleNotificationChange(
                "interviewCompleted"
              )
            }
          />

          <NotificationToggle
            label="Candidate Shortlisted"
            description="Get notified when a candidate is shortlisted."
            checked={notifications.shortlisted}
            onChange={() =>
              handleNotificationChange(
                "shortlisted"
              )
            }
          />

          <NotificationToggle
            label="Email Notifications"
            description="Receive important recruiter updates through email."
            checked={notifications.emailNotifications}
            onChange={() =>
              handleNotificationChange(
                "emailNotifications"
              )
            }
          />

        </div>

      </section>


      {/* SECURITY */}

      <section className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h2>Account Security</h2>

            <p>
              Review your account security information.
            </p>
          </div>

        </div>


        <div className="security-grid">

          <div>
            <span>Account Status</span>
            <strong>
              {profile?.status || "N/A"}
            </strong>
          </div>

          <div>
            <span>Email Verification</span>
            <strong>
              {profile?.emailVerified
                ? "Verified"
                : "Not Verified"}
            </strong>
          </div>

          <div>
            <span>Last Login</span>
            <strong>
              {profile?.lastLogin
                ? new Date(
                    profile.lastLogin
                  ).toLocaleString()
                : "Not available"}
            </strong>
          </div>

        </div>

      </section>

    </div>
  );
};


/* =============================================
   PASSWORD INPUT
============================================= */

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  show,
  setShow,
}) => {
  return (
    <div className="settings-field">

      <label>{label}</label>

      <div className="password-input-wrapper">

        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          required
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="password-toggle"
        >
          {show ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>

      </div>

    </div>
  );
};


/* =============================================
   NOTIFICATION TOGGLE
============================================= */

const NotificationToggle = ({
  label,
  description,
  checked,
  onChange,
}) => {
  return (
    <div className="notification-item">

      <div>
        <h3>{label}</h3>
        <p>{description}</p>
      </div>

      <button
        type="button"
        className={`toggle ${
          checked ? "active" : ""
        }`}
        onClick={onChange}
      >
        <span />
      </button>

    </div>
  );
};

export default Settings;