import React, { useContext, useEffect } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useContext(LanguageContext);

  // Restricted to the three languages actually supported by this deployment.
  const languagesList = [
    'English', 'Hindi (हिन्दी)', 'Bengali (বাংলা)'
  ];

  // Guard: if a previously-saved language (e.g. from localStorage, via
  // LanguageContext) is no longer in the allowed list, fall back to English
  // instead of leaving the <select> pointed at an option that no longer exists.
  useEffect(() => {
    if (!languagesList.includes(language)) {
      setLanguage('English');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className="flex items-center space-x-2 bg-white/80 backdrop-blur p-1 rounded-lg border border-gray-200 shadow-sm">
      <span className="text-xs font-bold text-gray-600 pl-1">🌐 Translator:</span>
      <select
        value={languagesList.includes(language) ? language : 'English'}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-transparent text-gray-800 text-xs py-1 px-2 rounded focus:outline-none font-semibold cursor-pointer"
      >
        {languagesList.map((lang, idx) => (
          <option key={idx} value={lang}>{lang}</option>
        ))}
      </select>
    </div>
  );
}