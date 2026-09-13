import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export function ThemeProvider({ children }) {
  // Initialize from whatever was saved last time, falling back to
  // false (light mode) if nothing's stored yet or storage isn't
  // available (e.g. private browsing).
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      return stored === 'dark';
    } catch {
      return false;
    }
  });

  // This is the piece that actually makes Tailwind's dark: classes
  // work: it adds/removes a `dark` class on <html> every time
  // isDarkMode changes. Navbar, MegaMenu, and Dashboard's drawer all
  // read/write isDarkMode through this same context, so one tap in
  // any of them flips this class — and every dark: className in the
  // app — simultaneously.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    try {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    } catch {
      // ignore storage errors (e.g. private browsing, quota)
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}