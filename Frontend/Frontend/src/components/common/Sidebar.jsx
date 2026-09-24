import {
  LayoutDashboard,
  BriefcaseBusiness,
  FileText,
  ClipboardCheck,
  Mic,
  Users,
  UserRound,
  PlusCircle,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const candidateMenu = [
    {
      label: "Dashboard",
      path: "/candidate/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Find Jobs",
      path: "/candidate/jobs",
      icon: BriefcaseBusiness,
    },
    {
      label: "My Applications",
      path: "/candidate/applications",
      icon: FileText,
    },
    {
      label: "Assessments",
      path: "/candidate/assessments",
      icon: ClipboardCheck,
    },
    {
      label: "Interviews",
      path: "/candidate/interviews",
      icon: Mic,
    },
    {
      label: "Profile",
      path: "/candidate/profile",
      icon: UserRound,
    },
  ];

  const recruiterMenu = [
    {
      label: "Dashboard",
      path: "/recruiter/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Jobs",
      path: "/recruiter/jobs",
      icon: BriefcaseBusiness,
    },
    // {
    //   label: "Create Job",
    //   path: "/recruiter/jobs/create",
    //   icon: PlusCircle,
    // },
    {
      label: "Candidates",
      path: "/recruiter/candidates",
      icon: Users,
    },
    {
      label: "Shortlisted",
      path: "/recruiter/shortlisted",
      icon: ClipboardCheck,
    },
    {
      label: "Profile",
      path: "/recruiter/profile",
      icon: UserRound,
    },
  ];

  const menu =
    role === "CANDIDATE"
      ? candidateMenu
      : recruiterMenu;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="app-sidebar">

      {/* Logo */}

      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Sparkles size={19} />
        </div>

        <div>
          <h2>HireAI</h2>
          <span>Recruitment Platform</span>
        </div>
      </div>

      {/* Navigation */}

      <nav className="sidebar-navigation">

        <p className="sidebar-section-title">
          WORKSPACE
        </p>

        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <Icon size={18} />

              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <p className="sidebar-section-title settings-title">
          ACCOUNT
        </p>

        <NavLink
          to={
            role === "CANDIDATE"
              ? "/candidate/settings"
              : "/recruiter/settings"
          }
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <Settings size={18} />

          <span>Settings</span>
        </NavLink>

      </nav>

      {/* User */}

      <div className="sidebar-bottom">

        <div className="sidebar-user">

          <div className="sidebar-avatar">
            {user?.fullName?.charAt(0)?.toUpperCase()}
          </div>

          <div className="sidebar-user-info">
            <strong>{user?.fullName}</strong>

            <span>
              {role === "CANDIDATE"
                ? "Candidate"
                : "Recruiter"}
            </span>
          </div>

        </div>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;