import React, { useEffect, useState, useRef } from "react";
import axios from "../../api/axios";
import "./Profile.css";

/* ─── constants ─── */
const LEVEL_META = {
  pg:   { label: "PG",   color: "#6D28D9", bg: "#F5F3FF" },
  ug:   { label: "UG",   color: "#1D4ED8", bg: "#EFF6FF" },
  hsc:  { label: "HSC",  color: "#047857", bg: "#ECFDF5" },
  sslc: { label: "SSLC", color: "#B45309", bg: "#FFFBEB" },
};

/* ─── SVG icons ─── */
const Ic = ({ d, size = 16, sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const EditIcon     = s => <Ic size={s.size} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />;
const PlusIcon     = s => <Ic size={s.size} d="M12 5v14M5 12h14" />;
const TrashIcon    = s => <Ic size={s.size} d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />;
const XIcon        = s => <Ic size={s.size} d="M18 6 6 18M6 6l12 12" />;
const UploadIcon   = s => <Ic size={s.size} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />;
const DownloadIcon = s => <Ic size={s.size} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />;
const MailIcon     = s => <Ic size={s.size} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />;
const PhoneIcon    = s => <Ic size={s.size} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.8 19.8 0 0 1 1.15 3.42 2 2 0 0 1 3.12 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 21 16z" />;
const MapPinIcon   = s => <Ic size={s.size} d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />;
const CheckIcon    = s => <Ic size={s.size} d="M20 6 9 17 4 12" />;
const AlertIcon    = s => <Ic size={s.size} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />;
const GradIcon     = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);
const FileIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const StarIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
  </svg>
);

/* ─── Avatar ─── */
function Avatar({ name, size = 96 }) {
  const ini = (name || "U").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="pf-avatar" style={{ width: size, height: size, fontSize: size * 0.33 }}>
      {ini}
    </div>
  );
}

/* ─── Toast ─── */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`pf-toast pf-toast--${toast.type}`}>
      {toast.type === "success" ? <CheckIcon size={14} /> : <AlertIcon size={14} />}
      {toast.msg}
    </div>
  );
}

/* ─── Modal shell ─── */
function Modal({ show, title, onClose, children, footer }) {
  if (!show) return null;
  return (
    <div className="pf-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pf-modal">
        <div className="pf-modal__head">
          <h3 className="pf-modal__title">{title}</h3>
          <button className="pf-icon-btn" onClick={onClose}><XIcon size={16} /></button>
        </div>
        <div className="pf-modal__body">{children}</div>
        {footer && <div className="pf-modal__foot">{footer}</div>}
      </div>
    </div>
  );
}

/* ─── Field ─── */
const Field = ({ label, req, children }) => (
  <div className="pf-field">
    <label className="pf-label">{label}{req && <span className="pf-req"> *</span>}</label>
    {children}
  </div>
);

/* ══════════════════════════════════
   MAIN
══════════════════════════════════ */
export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [educations, setEducations] = useState([]);
  const [profile, setProfile]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState(null);

  /* edu modal */
  const [eduModal, setEduModal] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [eduForm, setEduForm]   = useState({ level: "", institution_name: "", degree: "", percentage: "", city: "" });

  /* profile modal */
  const [profModal, setProfModal]   = useState(false);
  const [profForm, setProfForm]     = useState({ phone: "" });

  /* skills modal */
  const [skillModal, setSkillModal] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skillDraft, setSkillDraft] = useState([]);

  /* resume */
  const resumeRef = useRef();
  const [resumeUploading, setResumeUploading] = useState(false);

  /* ── load ── */
  useEffect(() => {
    Promise.all([fetchEdu(), fetchProfile()]).finally(() => setLoading(false));
  }, []);

  const flash = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchEdu = async () => {
    try { const r = await axios.get("/candidates/get-education/"); setEducations(r.data); } catch {}
  };

  const fetchProfile = async () => {
    try { const r = await axios.get("/candidates/get-profile/"); setProfile(r.data); } catch {}
  };

  /* ── Education ── */
  const openEdu = (edu = null) => {
    if (edu) { setEduForm(edu); setEditId(edu.id); }
    else { setEduForm({ level: "", institution_name: "", degree: "", percentage: "", city: "" }); setEditId(null); }
    setEduModal(true);
  };

  const submitEdu = async () => {
    if (!eduForm.level || !eduForm.degree || !eduForm.institution_name)
      return flash("Fill all required fields", "error");
    if (educations.some(e => e.level === eduForm.level && e.id !== editId))
      return flash(`${LEVEL_META[eduForm.level]?.label} record already exists`, "error");
    try {
      if (editId) await axios.put(`/candidates/update-education/${editId}/`, eduForm);
      else        await axios.post("/candidates/add-education/", eduForm);
      setEduModal(false); setEditId(null);
      fetchEdu();
      flash(editId ? "Education updated" : "Education added");
    } catch (e) { flash(e.response?.data?.detail || "Error", "error"); }
  };

  const deleteEdu = async id => {
    if (!window.confirm("Remove this record?")) return;
    try { await axios.delete(`/candidates/delete-education/${id}/`); fetchEdu(); flash("Removed"); }
    catch { flash("Delete failed", "error"); }
  };

  /* ── Profile ── */
  const openProf = () => { setProfForm({ phone: profile?.phone || "" }); setProfModal(true); };
  const submitProf = async () => {
    try {
      if (profile) await axios.put("/candidates/update-profile/", profForm);
      else         await axios.post("/candidates/create-profile/", profForm);
      setProfModal(false); fetchProfile(); flash("Profile updated");
    } catch (e) { flash(e.response?.data?.detail || "Error", "error"); }
  };

  /* ── Skills ── */
  const skillList = profile?.skills
    ? profile.skills.split(",").map(s => s.trim()).filter(Boolean)
    : [];

  const openSkills = () => { setSkillDraft([...skillList]); setSkillInput(""); setSkillModal(true); };

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v || skillDraft.map(s => s.toLowerCase()).includes(v.toLowerCase())) return;
    setSkillDraft([...skillDraft, v]);
    setSkillInput("");
  };

  const saveSkills = async () => {
    try {
      const payload = { skills: skillDraft.join(", ") };
      if (profile) await axios.put("/candidates/update-profile/", payload);
      else         await axios.post("/candidates/create-profile/", payload);
      setSkillModal(false); fetchProfile(); flash("Skills saved");
    } catch (e) { flash(e.response?.data?.detail || "Error", "error"); }
  };

  /* ── Resume ── */
  const uploadResume = async e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return flash("Max file size is 5 MB", "error");
    const ok = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!ok.includes(file.type)) return flash("Only PDF or DOC files allowed", "error");

    const fd = new FormData();
    fd.append("resume", file);
    setResumeUploading(true);
    try {
      if (profile) await axios.put("/candidates/update-profile/", fd, { headers: { "Content-Type": "multipart/form-data" } });
      else         await axios.post("/candidates/create-profile/", fd, { headers: { "Content-Type": "multipart/form-data" } });
      fetchProfile(); flash("Resume uploaded");
    } catch (e) { flash(e.response?.data?.detail || "Upload failed", "error"); }
    finally { setResumeUploading(false); e.target.value = ""; }
  };

  const resumeName = profile?.resume
    ? decodeURIComponent(profile.resume.split("/").pop().split("?")[0])
    : null;

  /* ── render ── */
  if (loading) return <div className="pf-loading"><div className="pf-spinner" /></div>;

  return (
    <div className="pf-root">
      <Toast toast={toast} />

      {/* COVER */}
      <div className="pf-cover" />

      <div className="pf-container">

        {/* HERO */}
        <div className="pf-hero-card">
          <div className="pf-hero-avatar-wrap">
            <Avatar name={user?.name} size={100} />
          </div>
          <div className="pf-hero-body">
            <div className="pf-hero-top">
              <div>
                <h1 className="pf-hero-name">{user?.name || "Your Name"}</h1>
                <div className="pf-hero-contacts">
                  {user?.email && <span className="pf-contact-chip"><MailIcon size={13} />{user.email}</span>}
                  {profile?.phone && <span className="pf-contact-chip"><PhoneIcon size={13} />{profile.phone}</span>}
                  {!profile?.phone && (
                    <button className="pf-contact-chip pf-contact-chip--add" onClick={openProf}>
                      <PlusIcon size={12} /> Add phone
                    </button>
                  )}
                </div>
              </div>
              <button className="pf-btn pf-btn--outline" onClick={openProf}>
                <EditIcon size={14} /> Edit
              </button>
            </div>
            {skillList.length > 0 && (
              <div className="pf-hero-skills">
                {skillList.slice(0, 6).map((s, i) => (
                  <span className="pf-hero-skill" key={i}>{s}</span>
                ))}
                {skillList.length > 6 && (
                  <span className="pf-hero-skill pf-hero-skill--more">+{skillList.length - 6}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TWO-COL LAYOUT */}
        <div className="pf-layout">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="pf-sidebar">

            {/* RESUME */}
            <div className="pf-card">
              <div className="pf-card-head">
                <span className="pf-card-icon pf-card-icon--blue"><FileIcon size={15} /></span>
                <h3 className="pf-card-title">Resume</h3>
              </div>

              {resumeName ? (
                <div className="pf-resume-exists">
                  <div className="pf-resume-file-row">
                    <div className="pf-resume-file-icon"><FileIcon size={20} /></div>
                    <div className="pf-resume-file-info">
                      <p className="pf-resume-filename">{resumeName}</p>
                      <p className="pf-resume-sub">Your uploaded resume</p>
                    </div>
                  </div>
                  <div className="pf-resume-btns">
                    <a className="pf-btn pf-btn--primary pf-btn--sm"
                      href={profile.resume} target="_blank" rel="noreferrer">
                      <DownloadIcon size={13} /> View / Download
                    </a>
                    <button className="pf-btn pf-btn--outline pf-btn--sm"
                      onClick={() => resumeRef.current?.click()}
                      disabled={resumeUploading}>
                      <UploadIcon size={13} />
                      {resumeUploading ? "Uploading…" : "Replace"}
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`pf-upload-zone ${resumeUploading ? "pf-upload-zone--loading" : ""}`}
                  onClick={() => !resumeUploading && resumeRef.current?.click()}
                >
                  <div className="pf-upload-ic"><UploadIcon size={26} /></div>
                  <p className="pf-upload-title">{resumeUploading ? "Uploading…" : "Upload Resume"}</p>
                  <p className="pf-upload-sub">PDF or DOC · Max 5 MB</p>
                </div>
              )}

              <input
                ref={resumeRef}
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={uploadResume}
              />
            </div>

            {/* SKILLS */}
            <div className="pf-card">
              <div className="pf-card-head">
                <span className="pf-card-icon pf-card-icon--violet"><StarIcon size={15} /></span>
                <h3 className="pf-card-title">Skills</h3>
                <button className="pf-icon-btn pf-icon-btn--sm" onClick={openSkills} title="Edit skills">
                  <EditIcon size={13} />
                </button>
              </div>

              {skillList.length === 0 ? (
                <button className="pf-empty-prompt" onClick={openSkills}>
                  <PlusIcon size={14} /> Add your skills
                </button>
              ) : (
                <div className="pf-tags">
                  {skillList.map((s, i) => <span className="pf-tag" key={i}>{s}</span>)}
                </div>
              )}
            </div>

          </aside>

          {/* ── MAIN COLUMN ── */}
          <main className="pf-main">

            {/* EDUCATION */}
            <div className="pf-card">
              <div className="pf-card-head">
                <span className="pf-card-icon pf-card-icon--green"><GradIcon size={15} /></span>
                <h3 className="pf-card-title">Education</h3>
                <button className="pf-btn pf-btn--outline pf-btn--sm" onClick={() => openEdu()}>
                  <PlusIcon size={13} /> Add
                </button>
              </div>

              {educations.length === 0 ? (
                <div className="pf-empty-state">
                  <GradIcon size={40} />
                  <p>No education records yet.</p>
                  <button className="pf-btn pf-btn--primary" onClick={() => openEdu()}>
                    <PlusIcon size={14} /> Add Education
                  </button>
                </div>
              ) : (
                <div className="pf-edu-list">
                  {educations.map((edu, idx) => {
                    const m = LEVEL_META[edu.level] || { label: edu.level.toUpperCase(), color: "#374151", bg: "#F3F4F6" };
                    return (
                      <React.Fragment key={edu.id}>
                        <div className="pf-edu-row">
                          <div className="pf-edu-icon-wrap" style={{ background: m.bg, color: m.color }}>
                            <GradIcon size={20} />
                          </div>
                          <div className="pf-edu-content">
                            <div className="pf-edu-header">
                              <div>
                                <h4 className="pf-edu-degree">{edu.degree}</h4>
                                <p className="pf-edu-inst">{edu.institution_name}</p>
                              </div>
                              <div className="pf-edu-controls">
                                <button className="pf-icon-btn pf-icon-btn--sm" onClick={() => openEdu(edu)}>
                                  <EditIcon size={13} />
                                </button>
                                <button className="pf-icon-btn pf-icon-btn--sm pf-icon-btn--danger" onClick={() => deleteEdu(edu.id)}>
                                  <TrashIcon size={13} />
                                </button>
                              </div>
                            </div>
                            <div className="pf-edu-chips">
                              <span className="pf-level-badge" style={{ background: m.bg, color: m.color }}>
                                {m.label}
                              </span>
                              {edu.city && (
                                <span className="pf-edu-chip">
                                  <MapPinIcon size={11} /> {edu.city}
                                </span>
                              )}
                              {edu.percentage && (
                                <span className="pf-edu-chip">
                                  <svg width={11} height={11} viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M18 20V10M12 20V4M6 20v-6" />
                                  </svg>
                                  {edu.percentage}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {idx < educations.length - 1 && <div className="pf-divider" />}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>

          </main>
        </div>
      </div>

      {/* ─── MODALS ─── */}

      {/* Education modal */}
      <Modal show={eduModal} title={editId ? "Edit Education" : "Add Education"}
        onClose={() => { setEduModal(false); setEditId(null); }}
        footer={
          <>
            <button className="pf-btn pf-btn--ghost" onClick={() => { setEduModal(false); setEditId(null); }}>Cancel</button>
            <button className="pf-btn pf-btn--primary" onClick={submitEdu}>{editId ? "Update" : "Add Education"}</button>
          </>
        }>
        <Field label="Education Level" req>
          <select className="pf-input" value={eduForm.level} onChange={e => setEduForm({ ...eduForm, level: e.target.value })}>
            <option value="">Select level</option>
            <option value="pg">PG — Post Graduate</option>
            <option value="ug">UG — Under Graduate</option>
            <option value="hsc">HSC — Class XII</option>
            <option value="sslc">SSLC — Class X</option>
          </select>
        </Field>
        <div className="pf-grid2">
          <Field label="Institution Name" req>
            <input className="pf-input" placeholder="e.g. Anna University"
              value={eduForm.institution_name} onChange={e => setEduForm({ ...eduForm, institution_name: e.target.value })} />
          </Field>
          <Field label="City">
            <input className="pf-input" placeholder="e.g. Chennai"
              value={eduForm.city} onChange={e => setEduForm({ ...eduForm, city: e.target.value })} />
          </Field>
        </div>
        <div className="pf-grid2">
          <Field label="Degree / Course" req>
            <input className="pf-input" placeholder="e.g. B.Tech CSE"
              value={eduForm.degree} onChange={e => setEduForm({ ...eduForm, degree: e.target.value })} />
          </Field>
          <Field label="Percentage / CGPA">
            <input className="pf-input" placeholder="e.g. 85.4"
              value={eduForm.percentage} onChange={e => setEduForm({ ...eduForm, percentage: e.target.value })} />
          </Field>
        </div>
      </Modal>

      {/* Profile modal */}
      <Modal show={profModal} title="Edit Profile"
        onClose={() => setProfModal(false)}
        footer={
          <>
            <button className="pf-btn pf-btn--ghost" onClick={() => setProfModal(false)}>Cancel</button>
            <button className="pf-btn pf-btn--primary" onClick={submitProf}>Save Changes</button>
          </>
        }>
        <Field label="Phone Number">
          <input className="pf-input" placeholder="e.g. 9876543210"
            value={profForm.phone} onChange={e => setProfForm({ ...profForm, phone: e.target.value })} />
        </Field>
      </Modal>

      {/* Skills modal */}
      <Modal show={skillModal} title="Manage Skills"
        onClose={() => setSkillModal(false)}
        footer={
          <>
            <button className="pf-btn pf-btn--ghost" onClick={() => setSkillModal(false)}>Cancel</button>
            <button className="pf-btn pf-btn--primary" onClick={saveSkills}>Save Skills</button>
          </>
        }>
        <Field label="Add a Skill">
          <div className="pf-skill-row">
            <input className="pf-input" placeholder="e.g. React, Django, Python…"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); } }}
            />
            <button className="pf-btn pf-btn--primary" onClick={addSkill}>Add</button>
          </div>
          <p className="pf-hint">Press Enter or comma to add quickly</p>
        </Field>
        {skillDraft.length > 0 && (
          <div className="pf-tags pf-tags--edit">
            {skillDraft.map((s, i) => (
              <span className="pf-tag pf-tag--removable" key={i}>
                {s}
                <button className="pf-tag-remove"
                  onClick={() => setSkillDraft(skillDraft.filter((_, x) => x !== i))}>
                  <XIcon size={10} />
                </button>
              </span>
            ))}
          </div>
        )}
      </Modal>

    </div>
  );
}