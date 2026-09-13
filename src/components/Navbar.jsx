import React, { useContext } from 'react';
import MegaMenu from './MegaMenu';
import FeatureMenu from './FeatureMenu';
import NoticeTicker from './NoticeTicker';
import Logo from './Logo';
import { OfflineSyncContext } from '../context/OfflineSyncContext';

// NOTE: LanguageSwitcher, AuthContext (logout), and ThemeContext are no
// longer used in Navbar. Account & System controls (Language, Dark Mode,
// Change Password, About, Help & Feedback, Logout) live in Dashboard's
// own hamburger drawer — see Dashboard.jsx's header comment.
//
// Both FeatureMenu and MegaMenu are back, deliberately positioned apart
// (FeatureMenu on the far left of row 2, MegaMenu on the far right) so
// they read as two distinct entry points rather than a confusing pair of
// adjacent, near-identical dropdowns. Worth knowing: FeatureMenu still
// carries its own copy of the Account & System section (Language, Dark
// Mode, Password, Logout) — so those controls are now reachable from
// BOTH FeatureMenu here AND Dashboard's drawer. That's an intentional
// tradeoff for now; say the word if you'd rather it only live in one
// place.

export default function Navbar({ setCurrentPage, setIsLoggedIn }) {
  const { isOffline } = useContext(OfflineSyncContext);

  const handleNavigate = (page, scrollTo) => {
    setCurrentPage(page);
    if (scrollTo) {
      setTimeout(() => {
        document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className="flex flex-col gap-2.5 bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 dark:from-gray-900 dark:via-gray-900 dark:to-teal-950 text-white px-3 py-2.5 sm:px-4 sm:py-3 shadow-lg border-b border-teal-600/40 dark:border-teal-900/60 sticky top-0 z-50 w-full">

      {/* Row 1: logo (left), offline badge + ticker (right). Swapped
          from the original layout (ticker left / logo center) — logo
          now takes the ticker's old left-side spot, and the ticker
          moved to the right side instead. Both sides stay shrink-0 so
          neither can be squeezed or overlap at any width. */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center shrink-0">
          <Logo onClick={() => setCurrentPage('dashboard')} />
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3 shrink-0">
          {isOffline && (
            <span className="bg-yellow-400 text-yellow-900 text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse shadow-sm whitespace-nowrap">
              🔴 Offline
            </span>
          )}
          <NoticeTicker />
        </div>
      </div>

      {/* Row 2: split into a left group (FeatureMenu) and a right group
          (Dashboard / Doctors / MegaMenu), with justify-between pushing
          them to opposite ends. flex-wrap on the right group lets those
          three drop to a second line on narrow phones instead of being
          clipped or squeezed — FeatureMenu on the left stays put either
          way since it's a single item. */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <FeatureMenu onNavigate={handleNavigate} />

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="bg-teal-900/60 hover:bg-teal-900 px-2.5 py-1.5 rounded-xl font-bold transition-all shadow-sm whitespace-nowrap"
          >
            Dashboard
          </button>

          <button
            onClick={() => setCurrentPage('find-doctor')}
            className="bg-teal-900/60 hover:bg-teal-900 px-2.5 py-1.5 rounded-xl font-bold transition-all shadow-sm whitespace-nowrap"
          >
            Doctors
          </button>

          <MegaMenu
            // Feature tiles call this with the real setCurrentPage key,
            // plus an optional scrollTo id for tiles that point at a
            // section of a page (currently just AI Symptom Checker →
            // the "dashboard" page, section id="symptom-checker").
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </nav>
  );
}