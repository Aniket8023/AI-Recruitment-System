import { useState, useRef, useEffect } from "react";

import {
  Bell,
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const Topbar = ({ title }) => {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);


  // =========================================================
  // ROLE LABEL
  // =========================================================

  const getRoleLabel = (role) => {

    switch (role) {

      case "CANDIDATE":
        return "Candidate";

      case "RECRUITER":
        return "Recruiter";

      case "COMPANY_ADMIN":
        return "Company Admin";

      case "ADMIN":
        return "Administrator";

      default:
        return "User";
    }
  };


  // =========================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);


  // =========================================================
  // PROFILE
  // =========================================================

  const handleProfile = () => {

    setProfileOpen(false);

    if (user?.role === "CANDIDATE") {

      navigate("/candidate/profile");

    } else {

      navigate("/recruiter/profile");

    }
  };


  // =========================================================
  // SETTINGS
  // =========================================================

  const handleSettings = () => {

    setProfileOpen(false);

    if (user?.role === "CANDIDATE") {

      navigate("/candidate/settings");

    } else {

      navigate("/recruiter/settings");

    }
  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    setProfileOpen(false);

    logout();

    navigate("/login", {
      replace: true,
    });
  };


  return (

    <header className="app-topbar">


      {/* =====================================================
          LEFT
      ===================================================== */}

      <div className="topbar-left">

        <div>

          <h1>
            {title}
          </h1>

          <p>
            Welcome back,{" "}
            {user?.fullName?.split(" ")[0] || "User"} 👋
          </p>

        </div>

      </div>


      {/* =====================================================
          RIGHT
      ===================================================== */}

      <div className="topbar-right">


        {/* SEARCH */}

        <div className="topbar-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search..."
          />

        </div>


        {/* NOTIFICATIONS */}

        <button
          type="button"
          className="notification-button"
          aria-label="Notifications"
        >

          <Bell size={19} />

          <span className="notification-dot"></span>

        </button>


        {/* PROFILE */}

        <div
          className="topbar-profile-wrapper"
          ref={profileRef}
        >

          <button
            type="button"
            className="topbar-profile"
            onClick={() =>
              setProfileOpen(
                (previous) => !previous
              )
            }
          >

            <div className="topbar-avatar">

              {user?.fullName
                ?.charAt(0)
                ?.toUpperCase() || "U"}

            </div>


            <div className="topbar-user">

              <strong>
                {user?.fullName || "User"}
              </strong>

              <span>
                {getRoleLabel(user?.role)}
              </span>

            </div>


            <ChevronDown
              size={16}
              className={
                profileOpen
                  ? "topbar-chevron-open"
                  : ""
              }
            />

          </button>


          {/* =================================================
              DROPDOWN
          ================================================= */}

          {profileOpen && (

            <div className="topbar-profile-dropdown">


              {/* USER INFO */}

              <div className="profile-dropdown-header">

                <div className="profile-dropdown-avatar">

                  {user?.fullName
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}

                </div>

                <div>

                  <strong>
                    {user?.fullName || "User"}
                  </strong>

                  <span>
                    {user?.email}
                  </span>

                </div>

              </div>


              <div className="profile-dropdown-divider" />


              {/* PROFILE */}

              <button
                type="button"
                className="profile-dropdown-item"
                onClick={handleProfile}
              >

                <User size={17} />

                <span>
                  My Profile
                </span>

              </button>


              {/* SETTINGS */}

              <button
                type="button"
                className="profile-dropdown-item"
                onClick={handleSettings}
              >

                <Settings size={17} />

                <span>
                  Settings
                </span>

              </button>


              <div className="profile-dropdown-divider" />


              {/* LOGOUT */}

              <button
                type="button"
                className="profile-dropdown-item profile-dropdown-logout"
                onClick={handleLogout}
              >

                <LogOut size={17} />

                <span>
                  Logout
                </span>

              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
};

export default Topbar;