import React, { useState, useRef, useEffect } from "react";

/**
 * Rural Telemedicine — Mega Menu
 * -------------------------------
 * Consolidates every feature card from the dashboard (Doctor Workspace,
 * Patient Records, Medicine Ordering, Emergency Organ & Blood, Smart Lab
 * Router, My Profile & Family, Tele-Consultation Room, Smart Care
 * Reminders, Emergency Admission, Hospital & Clinic Finder) into one
 * grouped, tap-to-open dropdown.
 *
 * UPDATED: the old "AI Symptom Checker" tile (which scrolled to a
 * `symptom-checker` section on the Dashboard page) has been removed —
 * that section no longer exists on Dashboard. Replaced with "Hospital &
 * Clinic Finder", which links to the dedicated HospitalFinder page
 * instead (see pages/HospitalFinder.jsx) — a full page, not a scroll
 * target, so no scrollTo is needed for this tile.
 *
 * The "Account & System" section (Language, Dark Mode, Change Password,
 * About, Help & Feedback, Announcements, Logout) remains removed from
 * this component — those controls live in FeatureMenu.jsx and/or
 * Dashboard's own hamburger drawer.
 *
 *   <MegaMenu
 *     onNavigate={(pageKey, scrollToId) => setCurrentPage(pageKey)}
 *   />
 *
 * NAVIGATION
 * ----------
 * Feature tiles call onNavigate(pageKey, scrollToId). pageKey matches
 * whatever string your setCurrentPage(...) expects. scrollToId is only
 * relevant for tiles that point at a *section* of a page rather than a
 * dedicated page — none of the current tiles use it, but the mechanism
 * is still supported if you add one later. Wire it like:
 *
 *   onNavigate={(page, scrollTo) => {
 *     setCurrentPage(page);
 *     if (scrollTo) {
 *       setTimeout(() => {
 *         document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" });
 *       }, 100);
 *     }
 *   }}
 */

const FEATURE_SECTIONS = [
  {
    label: "Care & Consultation",
    items: [
      {
        icon: "🩺",
        title: "Doctor Workspace",
        desc: "View queues, consult patients, manage cases",
        page: "doctor-profile",
        accent: "#5B5BF6",
      },
      {
        icon: "📞",
        title: "Tele-Consultation Room",
        desc: "Connect securely with verified physicians",
        page: "video",
        accent: "#2F855A",
      },
      {
        icon: "📱",
        title: "Smart Care Reminders",
        desc: "Automated SMS, call, and WhatsApp reminders",
        page: "reminders",
        accent: "#2F855A",
      },
    ],
  },
  {
    label: "Records & Pharmacy",
    items: [
      {
        icon: "📁",
        title: "Patient Records",
        desc: "Daily queues, health dossiers, pricing",
        page: "records-dashboard",
        accent: "#146C43",
      },
      {
        icon: "💊",
        title: "Medicine Ordering",
        desc: "Order medicines, track delivery to your village",
        page: "medicine-order",
        accent: "#0F9D8C",
      },
      {
        icon: "👥",
        title: "My Profile & Family",
        desc: "Manage your account and family members",
        page: "family-profile",
        accent: "#146C43",
      },
    ],
  },
  {
    label: "Emergency & Diagnostics",
    items: [
      {
        icon: "🏥",
        title: "Emergency Organ & Blood",
        desc: "Locate organ and blood availability fast",
        page: "emergency-donation",
        accent: "#C53030",
      },
      {
        icon: "🚑",
        title: "Emergency Admission",
        desc: "Book beds, dispatch ambulances, apply govt. schemes",
        page: "emergency-admission",
        accent: "#C53030",
      },
      {
        icon: "🔬",
        title: "Smart Lab Router",
        desc: "Route lab tests to the nearest available facility",
        page: "diagnostic-router",
        accent: "#2563EB",
      },
      {
        icon: "🗺️",
        title: "Hospital & Clinic Finder",
        desc: "AI-assisted nearest hospital search with live map",
        page: "hospital-finder",
        accent: "#4A5568",
      },
    ],
  },
];

export default function MegaMenu({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const closeMenu = () => setOpen(false);

  const navigate = (page, scrollTo) => {
    closeMenu();
    onNavigate && onNavigate(page, scrollTo);
  };

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
        All Services
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 12px)",
            right: 0,
            width: "min(760px, 94vw)",
            maxHeight: "80vh",
            overflowY: "auto",
            background: "#ffffff",
            borderRadius: 16,
            boxShadow: "0 20px 50px rgba(15, 30, 25, 0.22), 0 2px 8px rgba(15,30,25,0.08)",
            padding: "24px 24px 20px",
            zIndex: 60,
            animation: "megamenu-in 0.16s ease-out",
          }}
        >
          <style>{`
            @keyframes megamenu-in {
              from { opacity: 0; transform: translateY(-6px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (max-width: 900px) {
              .mm-grid { grid-template-columns: repeat(2, 1fr) !important; }
            }
            @media (max-width: 560px) {
              .mm-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>

          <div
            className="mm-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {FEATURE_SECTIONS.map((section) => (
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
                  {section.items.map((item) => (
                    <Tile
                      key={item.title}
                      item={item}
                      onActivate={() => navigate(item.page, item.scrollTo)}
                    />
                  ))}
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
      onMouseEnter={(e) => (e.currentTarget.style.background = "#F4FAF7")}
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
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1A2E27" }}>{item.title}</div>
        <div style={{ fontSize: 12, color: "#6B7B75", marginTop: 1, lineHeight: 1.35 }}>{item.desc}</div>
      </span>
    </button>
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