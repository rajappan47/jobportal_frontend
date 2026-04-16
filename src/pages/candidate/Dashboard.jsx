import { useState } from "react";

const NAV_ITEMS = [
  {
    section: "Menu",
    items: [
      {
        id: "dashboard", label: "Dashboard", badge: null,
        icon: (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".6"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".6"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/></svg>),
      },
      {
        id: "profile", label: "My Profile", badge: null,
        icon: (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M2 13c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
      },
      {
        id: "browse", label: "Browse Jobs", badge: null,
        icon: (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h9M2 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
      },
      {
        id: "applications", label: "Applications", badge: { label: "7", type: "purple" },
        icon: (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 2h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5"/><path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
      },
      {
        id: "interviews", label: "Interviews", badge: null,
        icon: (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M1 6h14" stroke="currentColor" strokeWidth="1.5"/></svg>),
      },
      {
        id: "saved", label: "Saved Jobs", badge: { label: "12", type: "amber" },
        icon: (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l2 4 4.5.7-3.2 3.1.7 4.5L8 11.2l-4 2.1.7-4.5L1.5 5.7 6 5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>),
      },
    ],
  },
  {
    section: "Account",
    items: [
      {
        id: "settings", label: "Settings", badge: null,
        icon: (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
      },
      {
        id: "logout", label: "Logout", badge: null,
        icon: (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h9M8 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
      },
    ],
  },
];

const RECOMMENDED_JOBS = [
  { id: 1, initials: "ST", bgColor: "#1a1033", textColor: "#a78bfa", title: "Senior Frontend Engineer", company: "Stripe", location: "San Francisco, CA · Remote", salary: "$145k–$175k", match: 98, matchType: "green" },
  { id: 2, initials: "LI", bgColor: "#001a2e", textColor: "#60a5fa", title: "Full-Stack Developer", company: "Linear", location: "New York, NY · Hybrid", salary: "$130k–$160k", match: 95, matchType: "green" },
  { id: 3, initials: "VR", bgColor: "#1c1a00", textColor: "#f59e0b", title: "React Developer", company: "Vercel", location: "Remote · Full-time", salary: "$120k–$150k", match: 90, matchType: "amber" },
  { id: 4, initials: "NX", bgColor: "#001a14", textColor: "#22d68a", title: "Software Engineer II", company: "Notion", location: "Remote · Full-time", salary: "$125k–$155k", match: 88, matchType: "blue" },
];

const APPLICATIONS = [
  { id: 1, dotColor: "#22d68a", title: "Stripe — Senior Frontend Engineer", date: "Applied Apr 10 · Technical round scheduled", status: "Interview", statusType: "green" },
  { id: 2, dotColor: "#f59e0b", title: "Figma — Product Engineer", date: "Applied Apr 8 · Under review", status: "Reviewing", statusType: "amber" },
  { id: 3, dotColor: "#60a5fa", title: "Linear — Full-Stack Developer", date: "Applied Apr 6 · Awaiting response", status: "Applied", statusType: "blue" },
  { id: 4, dotColor: "#f87171", title: "Notion — Software Engineer", date: "Applied Mar 30 · Not selected", status: "Rejected", statusType: "red" },
];

const INTERVIEWS = [
  { time: "10:00 AM", company: "Stripe", round: "Technical · Apr 16", label: "Tomorrow", type: "green" },
  { time: "2:00 PM", company: "Figma", round: "HR Round · Apr 18", label: "Fri", type: "amber" },
  { time: "11:30 AM", company: "Linear", round: "System Design · Apr 22", label: "Apr 22", type: "blue" },
];

const OFFERS = [
  { initials: "GH", bgColor: "#001a2e", textColor: "#60a5fa", title: "GitHub — Staff Engineer", salary: "$165,000/yr", expiry: "Offer expires Apr 22", borderColor: "#22d68a" },
  { initials: "CF", bgColor: "#1a1033", textColor: "#a78bfa", title: "Cloudflare — Frontend Dev", salary: "$142,000/yr", expiry: "Offer expires Apr 28", borderColor: "#f59e0b" },
];

const ALERTS = [
  { title: "React Developer", sub: "Remote · Any salary", count: "12 new", type: "green" },
  { title: "Full-Stack Engineer", sub: "SF / NY · $120k+", count: "8 new", type: "blue" },
  { title: "TypeScript Developer", sub: "Hybrid · $100k+", count: "5 new", type: "amber" },
];

const SKILLS = ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "GraphQL"];

const PROFILE_PROGRESS = [
  { label: "Resume", value: 100, color: "green" },
  { label: "Work Experience", value: 100, color: "green" },
  { label: "Skills", value: 80, color: "amber" },
  { label: "Portfolio", value: 30, color: "red" },
];

// ─── Pill Component ──────────────────────────────────────────────────────────
const pillStyles = {
  green:  { background: "#0f4f3322", color: "#22d68a", border: "1px solid #22d68a33" },
  amber:  { background: "#3d280022", color: "#f59e0b", border: "1px solid #f59e0b33" },
  red:    { background: "#3d0f0f22", color: "#f87171", border: "1px solid #f8717133" },
  blue:   { background: "#0f2a4a22", color: "#60a5fa", border: "1px solid #60a5fa33" },
  purple: { background: "#2d1f6622", color: "#a78bfa", border: "1px solid #7c6aff44" },
};

function Pill({ type = "blue", children, style = {} }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 9px", borderRadius: 20,
      fontSize: 11, fontWeight: 500,
      ...pillStyles[type], ...style,
    }}>
      {children}
    </span>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ active, onNav }) {
  return (
    <aside style={{
      width: 220, background: "#15161e",
      borderRight: "1px solid #2e2f44",
      padding: "1.5rem 1rem",
      display: "flex", flexDirection: "column", gap: 6,
      minHeight: "100vh", flexShrink: 0,
    }}>
      <div style={{
        fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700,
        color: "#a78bfa", padding: "0 0.5rem 1.2rem",
        borderBottom: "1px solid #2e2f44", marginBottom: "0.5rem", letterSpacing: -0.5,
      }}>
        hire<span style={{ color: "#62637e" }}>.</span>track
      </div>

      {NAV_ITEMS.map((group) => (
        <div key={group.section}>
          <div style={{ fontSize: 11, color: "#62637e", padding: "12px 12px 4px", textTransform: "uppercase", letterSpacing: 1 }}>
            {group.section}
          </div>
          {group.items.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNav(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", borderRadius: 8, cursor: "pointer",
                  fontSize: 13.5, width: "100%", border: "none",
                  background: isActive ? "#4f46e522" : "transparent",
                  color: isActive ? "#a78bfa" : "#a0a1c0",
                  fontWeight: isActive ? 500 : 400,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ opacity: 0.8, display: "flex", alignItems: "center" }}>{item.icon}</span>
                {item.label}
                {item.badge && (
                  <Pill type={item.badge.type} style={{ marginLeft: "auto", padding: "2px 7px" }}>
                    {item.badge.label}
                  </Pill>
                )}
              </button>
            );
          })}
        </div>
      ))}

      <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid #2e2f44" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 10px", borderRadius: 8, cursor: "pointer",
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg,#7c6aff,#a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0,
          }}>AK</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#f0f0f8" }}>Arjun Kumar</div>
            <div style={{ fontSize: 11, color: "#62637e" }}>Full-Stack Dev</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Topbar ──────────────────────────────────────────────────────────────────
function Topbar({ search, onSearch }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "1rem 1.5rem", borderBottom: "1px solid #2e2f44",
      background: "#15161e", position: "sticky", top: 0, zIndex: 10,
    }}>
      <div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 600, letterSpacing: -0.3, color: "#f0f0f8" }}>
          Good morning, Arjun 👋
        </h1>
        <p style={{ fontSize: 12.5, color: "#62637e", marginTop: 2 }}>
          Wednesday, April 15, 2026 — 3 interviews scheduled this week
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#1c1d28", border: "1px solid #2e2f44",
          borderRadius: 8, padding: "7px 12px", width: 220,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="#62637e" strokeWidth="1.4"/>
            <path d="M10 10l2.5 2.5" stroke="#62637e" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search jobs, companies..."
            style={{
              background: "none", border: "none", outline: "none",
              color: "#f0f0f8", fontSize: 13, fontFamily: "'DM Sans', sans-serif", width: "100%",
            }}
          />
        </div>
        <div style={{ position: "relative" }}>
          <button style={{
            width: 36, height: 36, borderRadius: 8, background: "#1c1d28",
            border: "1px solid #2e2f44", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1a5 5 0 0 1 5 5c0 3.5 1.5 4.5 1.5 4.5H1.5S3 9.5 3 6a5 5 0 0 1 5-5z" stroke="#a0a1c0" strokeWidth="1.4"/>
              <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0" stroke="#a0a1c0" strokeWidth="1.4"/>
            </svg>
          </button>
          <span style={{
            width: 7, height: 7, background: "#7c6aff", borderRadius: "50%",
            position: "absolute", top: 6, right: 6, border: "2px solid #15161e",
          }}/>
        </div>
        <button style={{
          width: 36, height: 36, borderRadius: 8, background: "#1c1d28",
          border: "1px solid #2e2f44", display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer",
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="#a0a1c0" strokeWidth="1.4"/>
            <path d="M1 6l7 4.5L15 6" stroke="#a0a1c0" strokeWidth="1.4"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Stat Cards ──────────────────────────────────────────────────────────────
function StatsRow() {
  const stats = [
    { label: "Applications", value: 24, valueColor: "#a78bfa", sub: "↑ 4 this week", subColor: "#22d68a" },
    { label: "In Review",    value: 9,  valueColor: "#f59e0b", sub: "↑ 2 new updates", subColor: "#22d68a" },
    { label: "Interviews",   value: 5,  valueColor: "#22d68a", sub: "↑ 3 scheduled",   subColor: "#22d68a" },
    { label: "Offers",       value: 2,  valueColor: "#60a5fa", sub: "Pending review",  subColor: "#62637e" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: "1.5rem" }}>
      {stats.map((s) => (
        <div key={s.label} style={{
          background: "#15161e", border: "1px solid #2e2f44",
          borderRadius: 16, padding: "1.1rem 1.2rem",
        }}>
          <div style={{ fontSize: 12, color: "#62637e", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 700, color: s.valueColor }}>{s.value}</div>
          <div style={{ fontSize: 12, color: s.subColor, marginTop: 4 }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Recommended Jobs ────────────────────────────────────────────────────────
function RecommendedJobs() {
  return (
    <div style={{ background: "#15161e", border: "1px solid #2e2f44", borderRadius: 16, padding: "1.2rem", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: "#f0f0f8" }}>Recommended Jobs</span>
        <span style={{ fontSize: 12, color: "#a78bfa", cursor: "pointer" }}>View all →</span>
      </div>
      {RECOMMENDED_JOBS.map((job) => (
        <div key={job.id} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 0", borderBottom: job.id < RECOMMENDED_JOBS.length ? "1px solid #2e2f44" : "none",
          cursor: "pointer",
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 9,
            background: job.bgColor, color: job.textColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 700,
            flexShrink: 0, border: "1px solid #2e2f44",
          }}>{job.initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: "#f0f0f8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.title}</div>
            <div style={{ fontSize: 12, color: "#62637e", marginTop: 2 }}>{job.company} · {job.location}</div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#22d68a" }}>{job.salary}</div>
            <div style={{ marginTop: 2 }}>
              <Pill type={job.matchType}>{job.match}% match</Pill>
            </div>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button style={{
          padding: "8px 16px", borderRadius: 8, fontSize: 13,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          cursor: "pointer", border: "none", background: "#7c6aff", color: "#fff",
        }}>Browse All Jobs</button>
        <button style={{
          padding: "8px 16px", borderRadius: 8, fontSize: 13,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          cursor: "pointer", background: "transparent",
          border: "1px solid #3a3b55", color: "#a0a1c0",
        }}>Edit Preferences</button>
      </div>
    </div>
  );
}

// ─── Application Pipeline ────────────────────────────────────────────────────
function ApplicationPipeline() {
  return (
    <div style={{ background: "#15161e", border: "1px solid #2e2f44", borderRadius: 16, padding: "1.2rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: "#f0f0f8" }}>Application Pipeline</span>
        <span style={{ fontSize: 12, color: "#a78bfa", cursor: "pointer" }}>See all 24 →</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {APPLICATIONS.map((app) => (
          <div key={app.id} style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#1c1d28", borderRadius: 10,
            padding: "10px 12px", border: "1px solid #2e2f44",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: app.dotColor, flexShrink: 0 }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#f0f0f8" }}>{app.title}</div>
              <div style={{ fontSize: 11.5, color: "#62637e", marginTop: 2 }}>{app.date}</div>
            </div>
            <Pill type={app.statusType}>{app.status}</Pill>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Profile Strength ────────────────────────────────────────────────────────
function ProfileStrength() {
  const progressColors = { green: ["#0f4f33", "#22d68a"], amber: ["#3d2800", "#f59e0b"], red: ["#3d0f0f", "#f87171"] };
  return (
    <div style={{ background: "#15161e", border: "1px solid #2e2f44", borderRadius: 16, padding: "1.2rem" }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: "#f0f0f8", marginBottom: "1rem" }}>Profile Strength</div>
      <div style={{ textAlign: "center", padding: "0.5rem 0 1rem" }}>
        <div style={{ width: 100, height: 100, margin: "0 auto 10px", position: "relative" }}>
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="50" cy="50" r="40" fill="none" stroke="#23243280" strokeWidth="10"/>
            <circle cx="50" cy="50" r="40" fill="none" stroke="url(#pg)" strokeWidth="10"
              strokeDasharray="251" strokeDashoffset="60" strokeLinecap="round"/>
            <defs>
              <linearGradient id="pg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4f46e5"/>
                <stop offset="100%" stopColor="#a78bfa"/>
              </linearGradient>
            </defs>
          </svg>
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: "#f0f0f8",
          }}>76%</div>
        </div>
        <div style={{ fontSize: 13, color: "#62637e" }}>Add portfolio & certifications to reach 100%</div>
      </div>

      {PROFILE_PROGRESS.map((p) => (
        <div key={p.label} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
            <span style={{ color: "#a0a1c0" }}>{p.label}</span>
            <span style={{ color: progressColors[p.color][1] }}>{p.value}%</span>
          </div>
          <div style={{ height: 6, background: "#1c1d28", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${p.value}%`, borderRadius: 3,
              background: `linear-gradient(90deg, ${progressColors[p.color][0]}, ${progressColors[p.color][1]})`,
            }}/>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
        {SKILLS.map((s) => (
          <span key={s} style={{
            background: "#1c1d28", border: "1px solid #3a3b55", borderRadius: 6,
            padding: "4px 10px", fontSize: 12, color: "#a0a1c0",
          }}>{s}</span>
        ))}
      </div>
      <button style={{
        width: "100%", marginTop: 12, padding: "8px 16px", borderRadius: 8,
        fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
        cursor: "pointer", background: "transparent", border: "1px solid #3a3b55", color: "#a0a1c0",
      }}>Complete Profile</button>
    </div>
  );
}

// ─── Upcoming Interviews ─────────────────────────────────────────────────────
function UpcomingInterviews() {
  const borderColors = { green: "#22d68a", amber: "#f59e0b", blue: "#60a5fa" };
  return (
    <div style={{ background: "#15161e", border: "1px solid #2e2f44", borderRadius: 16, padding: "1.2rem" }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: "#f0f0f8", marginBottom: "1rem" }}>
        Upcoming Interviews
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {INTERVIEWS.map((iv, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, alignItems: "center",
            padding: "9px 10px", background: "#1c1d28", borderRadius: 8,
            borderLeft: `3px solid ${borderColors[iv.type]}`,
          }}>
            <div style={{ fontSize: 11, color: "#a78bfa", fontWeight: 500, minWidth: 44 }}>{iv.time}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: "#f0f0f8" }}>{iv.company}</div>
              <div style={{ fontSize: 11.5, color: "#62637e" }}>{iv.round}</div>
            </div>
            <Pill type={iv.type} style={{ fontSize: 10.5 }}>{iv.label}</Pill>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Offers Received ─────────────────────────────────────────────────────────
function OffersReceived() {
  return (
    <div style={{ background: "#15161e", border: "1px solid #2e2f44", borderRadius: 16, padding: "1.2rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: "#f0f0f8" }}>Offers Received</span>
        <span style={{ fontSize: 12, color: "#a78bfa", cursor: "pointer" }}>Manage →</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {OFFERS.map((offer, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#1c1d28", borderRadius: 10,
            padding: "10px 12px", border: `1px solid ${offer.borderColor}22`,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: offer.bgColor, color: offer.textColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700, flexShrink: 0,
              border: "1px solid #2e2f44",
            }}>{offer.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#f0f0f8" }}>{offer.title}</div>
              <div style={{ fontSize: 11.5, color: offer.borderColor, marginTop: 2 }}>{offer.salary} · {offer.expiry}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <button style={{
                padding: "5px 12px", borderRadius: 8, fontSize: 12,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                cursor: "pointer", border: "none", background: "#7c6aff", color: "#fff",
              }}>Accept</button>
              <button style={{
                padding: "5px 12px", borderRadius: 8, fontSize: 12,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                cursor: "pointer", background: "transparent",
                border: "1px solid #3a3b55", color: "#a0a1c0",
              }}>Decline</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Job Alerts ──────────────────────────────────────────────────────────────
function JobAlerts() {
  return (
    <div style={{ background: "#15161e", border: "1px solid #2e2f44", borderRadius: 16, padding: "1.2rem" }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: "#f0f0f8", marginBottom: "1rem" }}>
        Job Alert Activity
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {ALERTS.map((a, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 10px", background: "#1c1d28", borderRadius: 8,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#f0f0f8" }}>{a.title}</div>
              <div style={{ fontSize: 11.5, color: "#62637e" }}>{a.sub}</div>
            </div>
            <Pill type={a.type}>{a.count}</Pill>
          </div>
        ))}
      </div>
      <button style={{
        width: "100%", marginTop: 12, padding: "8px 16px", borderRadius: 8,
        fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
        cursor: "pointer", background: "transparent", border: "1px solid #3a3b55", color: "#a0a1c0",
      }}>Manage Job Alerts</button>
    </div>
  );
}

// ─── Main Dashboard Page ─────────────────────────────────────────────────────
function DashboardPage() {
  return (
    <div style={{ padding: "1.5rem" }}>
      <StatsRow />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 14, marginBottom: "1.5rem" }}>
        <div>
          <RecommendedJobs />
          <ApplicationPipeline />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <ProfileStrength />
          <UpcomingInterviews />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <OffersReceived />
        <JobAlerts />
      </div>
    </div>
  );
}

// ─── Placeholder Pages ───────────────────────────────────────────────────────
function Placeholder({ title }) {
  return (
    <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#62637e" }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 600, color: "#a0a1c0", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14 }}>This section is under construction.</div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function CandidateDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [search, setSearch] = useState("");

  const pageMap = {
    dashboard:    <DashboardPage />,
    profile:      <Placeholder title="My Profile" />,
    browse:       <Placeholder title="Browse Jobs" />,
    applications: <Placeholder title="Applications" />,
    interviews:   <Placeholder title="Interviews" />,
    saved:        <Placeholder title="Saved Jobs" />,
    settings:     <Placeholder title="Settings" />,
    logout:       <Placeholder title="Logout" />,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0e0f14; }
        button:focus { outline: none; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #15161e; }
        ::-webkit-scrollbar-thumb { background: #2e2f44; border-radius: 3px; }
        input::placeholder { color: #62637e; }
      `}</style>

      <div style={{
        display: "flex", minHeight: "100vh",
        background: "#0e0f14", color: "#f0f0f8",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <Sidebar active={activeNav} onNav={setActiveNav} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Topbar search={search} onSearch={setSearch} />
          <div style={{ flex: 1, overflowY: "auto" }}>
            {pageMap[activeNav] || <DashboardPage />}
          </div>
        </div>
      </div>
    </>
  );
}