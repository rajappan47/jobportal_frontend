import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./CandidateDashboard.css";
import { useNavigate, useLocation } from "react-router-dom";

/* ─── icons ─── */
const Ic = ({ d, size = 18, sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const Icons = {
  grid:      d => <Ic size={d} d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />,
  briefcase: d => <Ic size={d} d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7M16 3v4M8 3v4M3 9h18M19 15l2 2 4-4" />,
  file:      d => <Ic size={d} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M12 11v6M9 14h6" />,
  bookmark:  d => <Ic size={d} d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
  user:      d => <Ic size={d} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />,
  settings:  d => <Ic size={d} d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />,
  logout:    d => <Ic size={d} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  bell:      d => <Ic size={d} d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />,
  search:    d => <Ic size={d} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />,
  map:       d => <Ic size={d} d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />,
  clock:     d => <Ic size={d} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2" />,
  trend:     d => <Ic size={d} d="M22 7l-8.5 8.5-5-5L1 18M22 7h-7M22 7v7" />,
  check:     d => <Ic size={d} d="M20 6 9 17 4 12" />,
  chevron:   d => <Ic size={d} d="M9 18l6-6-6-6" />,
  plus:      d => <Ic size={d} d="M12 5v14M5 12h14" />,
  eye:       d => <Ic size={d} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />,
  company:   d => <Ic size={d} d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10" />,
};

/* ─── status config ─── */
const STATUS = {
  applied:   { label: "Applied",   color: "#2563EB", bg: "#EFF6FF" },
  reviewing: { label: "Reviewing", color: "#7C3AED", bg: "#F5F3FF" },
  interview: { label: "Interview", color: "#D97706", bg: "#FFFBEB" },
  selected:  { label: "Selected",  color: "#059669", bg: "#ECFDF5" },
  rejected:  { label: "Rejected",  color: "#DC2626", bg: "#FEF2F2" },
};

/* ─── avatar ─── */
function Avatar({ name, size = 40 }) {
  const ini = (name || "U").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="cd-avatar" style={{ width: size, height: size, fontSize: size * 0.34 }}>
      {ini}
    </div>
  );
}

/* ─── status badge ─── */
function Badge({ status }) {
  const s = STATUS[status] || { label: status, color: "#6B7280", bg: "#F3F4F6" };
  return (
    <span className="cd-badge" style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
}

/* ─── nav items ─── */
const NAV = [
  { id: "dashboard",    label: "Dashboard",       icon: s => Icons.grid(s),      path: null },
  { id: "jobs",         label: "Job Listings",     icon: s => Icons.briefcase(s), path: "/candidate/jobs" },
  { id: "applications", label: "My Applications",  icon: s => Icons.file(s),      path: "/candidate/applications" },
  { id: "saved",        label: "Saved Jobs",       icon: s => Icons.bookmark(s),  path: "/candidate/saved" },
  { id: "profile",      label: "Profile",          icon: s => Icons.user(s),      path: "/candidate/profile" },
  { id: "settings",     label: "Settings",         icon: s => Icons.settings(s),  path: "/candidate/settings" },
];

/* ══════════════════════════════════
   MAIN
══════════════════════════════════ */
export default function CandidateDashboard() {
  const user       = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate   = useNavigate();
  const location   = useLocation();

  const [jobs, setJobs]               = useState([]);
  const [applications, setApps]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav]     = useState("dashboard");

  const stats = {
    applied:    applications.length,
    interviews: applications.filter(a => a.status === "interview").length,
    offers:     applications.filter(a => a.status === "selected").length,
    reviewing:  applications.filter(a => a.status === "reviewing").length,
  };

  const completion = (() => {
    let score = 20; // base
    if (user?.name)  score += 20;
    if (user?.email) score += 20;
    if (applications.length > 0) score += 20;
    if (jobs.length > 0) score += 20;
    return score;
  })();

  useEffect(() => {
    (async () => {
      try {
        const [jobsRes, appRes] = await Promise.all([
          axios.get("/jobs/list/"),
          axios.get("/applications/list/"),
        ]);
        setJobs(jobsRes.data);
        setApps(appRes.data);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const handleNav = (item) => {
    setActiveNav(item.id);
    setSidebarOpen(false);
    if (item.path) navigate(item.path);
  };

  const handleApply = async (jobId) => {
    try {
      await axios.post("/applications/apply/", { job: jobId });
      const r = await axios.get("/applications/list/");
      setApps(r.data);
    } catch {}
  };

  /* ════════ RENDER ════════ */
  return (
    <div className="cd-root">

      {/* mobile overlay */}
      {sidebarOpen && <div className="cd-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── SIDEBAR ── */}
      <aside className={`cd-sidebar ${sidebarOpen ? "cd-sidebar--open" : ""}`}>
        <div className="cd-sidebar__logo">
          <div className="cd-logo-mark">
            <Icons.briefcase size={18} />
          </div>
          <span className="cd-logo-text">JobPortal</span>
        </div>

        <div className="cd-sidebar__profile">
          <Avatar name={user?.name} size={44} />
          <div>
            <p className="cd-sidebar__name">{user?.name || "Candidate"}</p>
            <p className="cd-sidebar__role">Job Seeker</p>
          </div>
        </div>

        {/* profile completion */}
        <div className="cd-completion">
          <div className="cd-completion__top">
            <span>Profile Strength</span>
            <span className="cd-completion__pct">{completion}%</span>
          </div>
          <div className="cd-completion__bar">
            <div className="cd-completion__fill" style={{ width: `${completion}%` }} />
          </div>
        </div>

        <nav className="cd-nav">
          {NAV.map(item => (
            <button
              key={item.id}
              className={`cd-nav__item ${activeNav === item.id ? "cd-nav__item--active" : ""}`}
              onClick={() => handleNav(item)}
            >
              <span className="cd-nav__icon">{item.icon(17)}</span>
              <span className="cd-nav__label">{item.label}</span>
              {activeNav === item.id && <span className="cd-nav__pip" />}
            </button>
          ))}
        </nav>

        <button className="cd-nav__item cd-nav__item--logout"
          onClick={() => { localStorage.clear(); navigate("/login"); }}>
          <span className="cd-nav__icon"><Icons.logout size={17} /></span>
          <span className="cd-nav__label">Logout</span>
        </button>
      </aside>

      {/* ── MAIN ── */}
      <div className="cd-main">

        {/* TOPBAR */}
        <header className="cd-topbar">
          <div className="cd-topbar__left">
            <button className="cd-hamburger" onClick={() => setSidebarOpen(o => !o)}>
              <span /><span /><span />
            </button>
            <div className="cd-search">
              <span className="cd-search__icon"><Icons.search size={15} /></span>
              <input placeholder="Search jobs, companies…" />
            </div>
          </div>
          <div className="cd-topbar__right">
            <button className="cd-topbar__icon-btn">
              <Icons.bell size={18} />
              <span className="cd-notif-dot" />
            </button>
            <Avatar name={user?.name} size={36} />
          </div>
        </header>

        {/* SCROLL BODY */}
        <div className="cd-body">

          {/* GREETING */}
          <div className="cd-greeting">
            <div>
              <h1 className="cd-greeting__title">
                Good morning, <span>{user?.name?.split(" ")[0] || "there"}</span> 👋
              </h1>
              <p className="cd-greeting__sub">Here's what's happening with your job search today.</p>
            </div>
            <button className="cd-btn cd-btn--primary"
              onClick={() => navigate("/candidate/jobs")}>
              <Icons.plus size={15} /> Browse Jobs
            </button>
          </div>

          {/* STAT CARDS */}
          <div className="cd-stats">
            {[
              { label: "Total Applied",  value: stats.applied,    icon: <Icons.file size={20} />,      color: "blue"   },
              { label: "In Review",      value: stats.reviewing,  icon: <Icons.eye size={20} />,       color: "violet" },
              { label: "Interviews",     value: stats.interviews, icon: <Icons.briefcase size={20} />, color: "amber"  },
              { label: "Offers",         value: stats.offers,     icon: <Icons.check size={20} />,     color: "green"  },
            ].map(s => (
              <div className={`cd-stat-card cd-stat-card--${s.color}`} key={s.label}>
                <div className="cd-stat-card__icon">{s.icon}</div>
                <div>
                  <p className="cd-stat-card__value">{s.value}</p>
                  <p className="cd-stat-card__label">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* TWO COLUMNS */}
          <div className="cd-columns">

            {/* LEFT */}
            <div className="cd-col-main">

              {/* RECOMMENDED JOBS */}
              <div className="cd-panel">
                <div className="cd-panel__head">
                  <h2 className="cd-panel__title">Recommended Jobs</h2>
                  <button className="cd-link" onClick={() => navigate("/candidate/jobs")}>
                    View all <Icons.chevron size={14} />
                  </button>
                </div>

                {loading ? (
                  <div className="cd-skeleton-list">
                    {[1, 2, 3].map(i => <div className="cd-skeleton" key={i} />)}
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="cd-empty">
                    <Icons.briefcase size={36} />
                    <p>No jobs available right now</p>
                  </div>
                ) : (
                  <div className="cd-job-list">
                    {jobs.slice(0, 4).map(job => {
                      const applied = applications.some(a => a.job === job.id);
                      return (
                        <div className="cd-job-card" key={job.id}>
                          <div className="cd-job-card__logo">
                            <Icons.company size={20} />
                          </div>
                          <div className="cd-job-card__body">
                            <div className="cd-job-card__top">
                              <div>
                                <h4 className="cd-job-card__title">{job.title}</h4>
                                <p className="cd-job-card__company">{job.company_name || "Company"}</p>
                              </div>
                              {job.salary && (
                                <span className="cd-job-card__salary">{job.salary}</span>
                              )}
                            </div>
                            <p className="cd-job-card__desc">
                              {(job.description || "").substring(0, 90)}…
                            </p>
                            <div className="cd-job-card__foot">
                              <div className="cd-job-card__chips">
                                {job.location && (
                                  <span className="cd-chip"><Icons.map size={11} />{job.location}</span>
                                )}
                                {job.job_type && (
                                  <span className="cd-chip"><Icons.clock size={11} />{job.job_type}</span>
                                )}
                              </div>
                              <button
                                className={`cd-btn cd-btn--sm ${applied ? "cd-btn--applied" : "cd-btn--primary"}`}
                                onClick={() => !applied && handleApply(job.id)}
                                disabled={applied}
                              >
                                {applied ? <><Icons.check size={13} /> Applied</> : "Apply Now"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* MY APPLICATIONS */}
              <div className="cd-panel">
                <div className="cd-panel__head">
                  <h2 className="cd-panel__title">My Applications</h2>
                  <button className="cd-link" onClick={() => navigate("/candidate/applications")}>
                    View all <Icons.chevron size={14} />
                  </button>
                </div>

                {applications.length === 0 ? (
                  <div className="cd-empty">
                    <Icons.file size={36} />
                    <p>No applications yet. Start applying!</p>
                  </div>
                ) : (
                  <div className="cd-app-list">
                    {applications.slice(0, 4).map(app => (
                      <div className="cd-app-row" key={app.id}>
                        <div className="cd-app-row__logo">
                          <Icons.company size={16} />
                        </div>
                        <div className="cd-app-row__info">
                          <p className="cd-app-row__title">{app.job_title || "Position"}</p>
                          <p className="cd-app-row__company">{app.company_name || "Company"}</p>
                        </div>
                        <Badge status={app.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT */}
            <div className="cd-col-side">

              {/* APPLICATION PIPELINE */}
              <div className="cd-panel">
                <h2 className="cd-panel__title" style={{ marginBottom: 16 }}>Application Pipeline</h2>
                {[
                  { label: "Applied",   count: stats.applied,    color: "#2563EB" },
                  { label: "Reviewing", count: stats.reviewing,  color: "#7C3AED" },
                  { label: "Interview", count: stats.interviews, color: "#D97706" },
                  { label: "Offer",     count: stats.offers,     color: "#059669" },
                ].map(step => (
                  <div className="cd-pipeline-step" key={step.label}>
                    <div className="cd-pipeline-step__dot" style={{ background: step.color }} />
                    <span className="cd-pipeline-step__label">{step.label}</span>
                    <span className="cd-pipeline-step__count">{step.count}</span>
                    <div className="cd-pipeline-step__bar">
                      <div style={{
                        width: stats.applied > 0 ? `${(step.count / stats.applied) * 100}%` : "0%",
                        background: step.color
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* TIPS */}
              <div className="cd-panel cd-tips">
                <h2 className="cd-panel__title">Quick Tips</h2>
                {[
                  "Complete your profile to get noticed",
                  "Upload your latest resume",
                  "Apply early — recruiters check first",
                  "Tailor your cover letter each time",
                ].map((t, i) => (
                  <div className="cd-tip" key={i}>
                    <span className="cd-tip__num">{i + 1}</span>
                    <p>{t}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}