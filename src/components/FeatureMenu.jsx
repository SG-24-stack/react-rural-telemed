import React, { useState, useRef, useEffect } from "react";

// FEATURE_SECTIONS previously held a single "Emergency & Diagnostics"
// section with just the "AI Symptom Checker" tile (scrolled to a
// `symptom-checker` section on Dashboard that no longer exists). Removed
// entirely, per instruction — the new "Hospital & Clinic Finder" feature
// was added to MegaMenu.jsx only, not here. This menu now shows just the
// "Account & System" section below.
const FEATURE_SECTIONS = [];

const LANGUAGE_LABELS = {
  english: "English",
  hindi: "हिंदी (Hindi)",
  bengali: "বাংলা (Bengali)",
};
const DEFAULT_LANGUAGES = ["english", "hindi", "bengali"];

export default function FeatureMenu({
  onNavigate,
  language = "english",
  languages = DEFAULT_LANGUAGES,
  onLanguageChange,
  languageControl,
  darkMode,
  onToggleDarkMode,
  onUpdatePassword,
  onOpenAnnouncements,
  onLogout,
}) {
  const [open, setOpen] = useState(false);
  const [expandedKey, setExpandedKey] = useState(null); // 'password' | 'about' | 'feedback' | 'announcements' | null
  const [currentLang, setCurrentLang] = useState(language);
  const [internalDarkMode, setInternalDarkMode] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const rootRef = useRef(null);

  const isDark = darkMode !== undefined ? darkMode : internalDarkMode;

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    if (onToggleDarkMode) {
      onToggleDarkMode(nextDark);
    } else {
      setInternalDarkMode(nextDark);
      if (nextDark) {
        document.documentElement.classList.add("dark");
        document.body.style.backgroundColor = "#111827";
        document.body.style.color = "#F9FAFB";
      } else {
        document.documentElement.classList.remove("dark");
        document.body.style.backgroundColor = "#FFFFFF";
        document.body.style.color = "#111827";
      }
    }
  };

  const handleLanguageSelect = (newLang) => {
    setCurrentLang(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  const handleLogoutAction = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.clear();
      window.location.reload();
    }
  };

  useEffect(() => {
    function onClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
        setExpandedKey(null);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") {
        setOpen(false);
        setExpandedKey(null);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const closeMenu = () => {
    setOpen(false);
    setExpandedKey(null);
  };

  const navigate = (page, scrollTo) => {
    closeMenu();
    if (onNavigate) {
      onNavigate(page, scrollTo);
    }
  };

  const systemSection = {
    label: "Account & System",
    items: [
      {
        key: "language",
        icon: "🌐",
        title: "Language",
        desc: LANGUAGE_LABELS[currentLang] || currentLang,
        accent: "#2F855A",
        render: () => (
          <LanguageTile
            language={currentLang}
            languages={languages}
            onLanguageChange={handleLanguageSelect}
            languageControl={languageControl}
            closeMenu={closeMenu}
          />
        ),
      },
      {
        key: "darkmode",
        icon: isDark ? "🌙" : "☀️",
        title: isDark ? "Dark Mode" : "Light Mode",
        desc: "Tap to switch appearance",
        accent: "#B7791F",
        onClick: toggleDarkMode,
        keepOpen: true,
      },
      {
        key: "password",
        icon: "🔒",
        title: "Change Password",
        desc: "Update your account password",
        accent: "#6B46C1",
        render: () => (
          <ExpandableTile
            icon="🔒"
            title="Change Password"
            desc="Update your account password"
            accent="#6B46C1"
            expanded={expandedKey === "password"}
            onToggle={() => setExpandedKey((k) => (k === "password" ? null : "password"))}
          >
            <PasswordPanel onUpdatePassword={onUpdatePassword} closeMenu={closeMenu} />
          </ExpandableTile>
        ),
      },
      {
        key: "about",
        icon: "ℹ️",
        title: "About",
        desc: "App info & version details",
        accent: "#0987A0",
        render: () => (
          <ExpandableTile
            icon="ℹ️"
            title="About"
            desc="App info & version details"
            accent="#0987A0"
            expanded={expandedKey === "about"}
            onToggle={() => setExpandedKey((k) => (k === "about" ? null : "about"))}
          >
            <AboutPanel />
          </ExpandableTile>
        ),
      },
      {
        key: "feedback",
        icon: "💬",
        title: "Help & Feedback",
        desc: "Report an issue or suggest a feature",
        accent: "#C05621",
        render: () => (
          <ExpandableTile
            icon="💬"
            title="Help & Feedback"
            desc="Report an issue or suggest a feature"
            accent="#C05621"
            expanded={expandedKey === "feedback"}
            onToggle={() => setExpandedKey((k) => (k === "feedback" ? null : "feedback"))}
          >
            <FeedbackPanel 
              feedbackText={feedbackText} 
              setFeedbackText={setFeedbackText} 
              feedbackSent={feedbackSent} 
              setFeedbackSent={setFeedbackSent} 
              closeMenu={closeMenu} 
            />
          </ExpandableTile>
        ),
      },
      {
        key: "announcements",
        icon: "📣",
        title: "Announcements",
        desc: "Latest updates and alerts",
        accent: "#B7791F",
        render: () => (
          <ExpandableTile
            icon="📣"
            title="Announcements"
            desc="Latest updates and alerts"
            accent="#B7791F"
            expanded={expandedKey === "announcements"}
            onToggle={() => {
              if (onOpenAnnouncements) onOpenAnnouncements();
              setExpandedKey((k) => (k === "announcements" ? null : "announcements"));
            }}
          >
            <AnnouncementsPanel />
          </ExpandableTile>
        ),
      },
      {
        key: "logout",
        icon: "🚪",
        title: "Logout",
        desc: "Sign out of your account",
        accent: "#C53030",
        onClick: handleLogoutAction,
        danger: true,
      },
    ],
  };

  const allSections = [...FEATURE_SECTIONS, systemSection];

  return (
    <div ref={rootRef} style={{ position: "relative", fontFamily: "Inter, system-ui, sans-serif" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 18px",
          borderRadius: 10,
          border: "none",
          background: "rgba(255,255,255,0.15)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
      >
        <MenuGlyph open={open} />
        Features
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 12px)",
            left: 0,
            width: allSections.length > 1 ? "min(800px, 94vw)" : "min(420px, 94vw)",
            maxHeight: "80vh",
            overflowY: "auto",
            background: "#ffffff",
            borderRadius: 16,
            boxShadow: "0 20px 50px rgba(15, 30, 25, 0.22), 0 2px 8px rgba(15,30,25,0.08)",
            padding: "24px 24px 20px",
            zIndex: 60,
            animation: "featuremenu-in 0.16s ease-out",
          }}
        >
          <style>{`
            @keyframes featuremenu-in {
              from { opacity: 0; transform: translateY(-6px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (max-width: 700px) {
              .fm-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>

          <div
            className="fm-grid"
            style={{
              display: "grid",
              gridTemplateColumns: allSections.length > 1 ? "repeat(2, 1fr)" : "1fr",
              gap: 20,
            }}
          >
            {allSections.map((section) => (
              <div key={section.label}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#8A9A93",
                    marginBottom: 12,
                    paddingBottom: 8,
                    borderBottom: "1px solid #EDF2F0",
                  }}
                >
                  {section.label}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {section.items.map((item) =>
                    item.render ? (
                      <div key={item.key || item.title}>{item.render()}</div>
                    ) : (
                      <Tile
                        key={item.key || item.title}
                        item={item}
                        onActivate={() => {
                          if (item.page) {
                            navigate(item.page, item.scrollTo);
                          } else {
                            if (!item.keepOpen) closeMenu();
                            item.onClick && item.onClick();
                          }
                        }}
                      />
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Tile({ item, onActivate }) {
  const isDanger = item.danger;

  return (
    <button
      role="menuitem"
      onClick={onActivate}
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        border: "none",
        background: "transparent",
        width: "100%",
        textAlign: "left",
        padding: "8px 8px",
        borderRadius: 10,
        cursor: "pointer",
        transition: "background 0.12s ease",
        font: "inherit",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = isDanger ? "#FBEAEA" : "#F4FAF7")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span
        style={{
          fontSize: 18,
          width: 30,
          height: 30,
          flexShrink: 0,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${item.accent}18`,
        }}
      >
        {item.icon}
      </span>
      <span>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: isDanger ? "#C53030" : "#1A2E27" }}>
          {item.title}
        </div>
        <div style={{ fontSize: 12, color: "#6B7B75", marginTop: 1, lineHeight: 1.35 }}>
          {item.desc}
        </div>
      </span>
    </button>
  );
}

function LanguageTile({ language, languages, onLanguageChange, languageControl, closeMenu }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 8px", borderRadius: 10 }}>
      <span
        style={{
          fontSize: 18,
          width: 30,
          height: 30,
          flexShrink: 0,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2F855A18",
        }}
      >
        🌐
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1A2E27", marginBottom: 2 }}>Language</div>
        {languageControl ? (
          <div onClick={closeMenu}>{languageControl}</div>
        ) : (
          <select
            value={language}
            onChange={(e) => {
              onLanguageChange && onLanguageChange(e.target.value);
            }}
            style={{
              border: "1px solid #E2E8E4",
              background: "#F8FAF9",
              padding: "4px 6px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              color: "#1A2E27",
              cursor: "pointer",
              outline: "none",
              width: "100%",
            }}
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {LANGUAGE_LABELS[lang] || lang}
              </option>
            ))}
          </select>
        )}
      </span>
    </div>
  );
}

function ExpandableTile({ icon, title, desc, accent, expanded, onToggle, children }) {
  return (
    <div>
      <button
        onClick={onToggle}
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          border: "none",
          background: expanded ? "#F4FAF7" : "transparent",
          width: "100%",
          textAlign: "left",
          padding: "8px 8px",
          borderRadius: 10,
          cursor: "pointer",
          font: "inherit",
        }}
      >
        <span
          style={{
            fontSize: 18,
            width: 30,
            height: 30,
            flexShrink: 0,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${accent}18`,
          }}
        >
          {icon}
        </span>
        <span style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1A2E27" }}>{title}</div>
          <div style={{ fontSize: 12, color: "#6B7B75", marginTop: 1, lineHeight: 1.35 }}>{desc}</div>
        </span>
      </button>
      {expanded && (
        <div style={{ padding: "4px 8px 10px 40px" }}>{children}</div>
      )}
    </div>
  );
}

function PasswordPanel({ onUpdatePassword, closeMenu }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("");

  const inputStyle = {
    width: "100%",
    marginTop: 3,
    padding: "6px 8px",
    border: "1px solid #E2E8E4",
    borderRadius: 6,
    fontSize: 12,
  };

  const submit = () => {
    if (!next || next !== confirm) {
      setStatus("New password and confirmation don't match.");
      return;
    }
    if (onUpdatePassword) onUpdatePassword(current, next);
    setStatus("Password updated successfully.");
    setCurrent("");
    setNext("");
    setConfirm("");
    setTimeout(closeMenu, 1000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 10, fontWeight: 700, color: "#8A9A93", textTransform: "uppercase" }}>
        Current password
        <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} style={inputStyle} />
      </label>
      <label style={{ fontSize: 10, fontWeight: 700, color: "#8A9A93", textTransform: "uppercase" }}>
        New password
        <input type="password" value={next} onChange={(e) => setNext(e.target.value)} style={inputStyle} />
      </label>
      <label style={{ fontSize: 10, fontWeight: 700, color: "#8A9A93", textTransform: "uppercase" }}>
        Confirm new password
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={inputStyle} />
      </label>
      <button
        onClick={submit}
        style={{
          marginTop: 4,
          background: "#6B46C1",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "6px 0",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Update Password
      </button>
      {status && <div style={{ fontSize: 11, color: "#2F855A", fontWeight: 600 }}>{status}</div>}
    </div>
  );
}

function FeedbackPanel({ feedbackText, setFeedbackText, feedbackSent, setFeedbackSent, closeMenu }) {
  const submitFeedback = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackText("");
      closeMenu();
    }, 1200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <p style={{ fontSize: 12, color: "#4A5A54", margin: 0 }}>
        Let us know if you found a bug or have a suggestion for rural telehealth:
      </p>
      {feedbackSent ? (
        <div style={{ fontSize: 12, color: "#2F855A", fontWeight: 700, padding: "6px 0" }}>
          ✓ Thank you! Feedback submitted successfully.
        </div>
      ) : (
        <form onSubmit={submitFeedback} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <textarea
            rows="3"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Describe your issue or feature idea..."
            style={{
              width: "100%",
              padding: "6px 8px",
              border: "1px solid #E2E8E4",
              borderRadius: 6,
              fontSize: 12,
              resize: "vertical",
            }}
            required
          />
          <button
            type="submit"
            style={{
              background: "#C05621",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "6px 0",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Send Feedback
          </button>
        </form>
      )}
    </div>
  );
}

function AnnouncementsPanel() {
  return (
    <div style={{ fontSize: 12, color: "#4A5A54", lineHeight: 1.5, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ background: "#FEF3C7", padding: "8px 10px", borderRadius: 8, borderLeft: "3px solid #D97706" }}>
        <p style={{ margin: 0, fontWeight: 700, color: "#92400E" }}>Free Eye Screening Camp</p>
        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#78350F" }}>Tomorrow at the Community Health Center from 10 AM.</p>
      </div>
      <div style={{ background: "#E0F2FE", padding: "8px 10px", borderRadius: 8, borderLeft: "3px solid #0284C7" }}>
        <p style={{ margin: 0, fontWeight: 700, color: "#0369A1" }}>Emergency Ambulance Upgrade</p>
        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#034873" }}>New GPS-enabled vehicles active across village routes.</p>
      </div>
    </div>
  );
}

function AboutPanel() {
  return (
    <div style={{ fontSize: 12, color: "#4A5A54", lineHeight: 1.5 }}>
      <p style={{ margin: 0 }}>
        A rural telehealth platform connecting village households with doctors, community health workers,
        emergency dispatch, digital pharmacies, and AI-assisted symptom triage.
      </p>
      <p style={{ margin: "6px 0 0" }}>
        <strong>Version:</strong> 1.0.0
        <br />
        <strong>Region:</strong> West Bengal, India
      </p>
    </div>
  );
}

function MenuGlyph({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transition: "transform 0.15s ease" }}>
      <rect x="1" y="3" width="14" height="1.6" rx="0.8" fill="currentColor" opacity={open ? 0.5 : 1} />
      <rect x="1" y="7.2" width="14" height="1.6" rx="0.8" fill="currentColor" />
      <rect x="1" y="11.4" width="14" height="1.6" rx="0.8" fill="currentColor" opacity={open ? 0.5 : 1} />
    </svg>
  );
}
