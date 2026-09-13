import React, { createContext, useState } from 'react';

export const LanguageContext = createContext();

const translations = {
  English: {
    title: 'Rural Telemedicine',
    dashboard: 'Healthcare Portal Dashboard',
    teleConsultation: 'Tele-Consultation Room',
    teleDesc: 'Connect securely with verified regional or global physicians.',
    startCall: 'Start Live Call',
    vaultTitle: 'Secure Privacy Vault',
    vaultDesc: 'Access your encrypted prescriptions, medical documents, and doctor guidelines.',
    openVault: 'Open Secure Vault',
    settings: 'Corner Settings & Account',
    settingsDesc: 'Manage language translation, text sizing, and symptoms.',
    openSettings: 'Open Settings ⚙️',
    smartDoc: 'Smart Doctor Recommendation',
    smartDocDesc: 'Select your consultation need to get matched with the right specialist.',
    regularCheckup: 'Regular / Routine Checkup',
    longTermCheckup: 'Long-Term / Chronic Care',
    docDirectory: 'Doctor Directory',
    nationalDoctors: '🇮🇳 National Doctors',
    intlDoctors: '🌐 International Doctors',
    medicineDir: 'Essential Medicine Prices',
    medName: 'Medicine Name',
    category: 'Category',
    price: 'Price',
    logout: 'Log Out',
    backToDashboard: 'Back to Dashboard',
    bookAppointment: 'Book Appointment',
  },
  'Bengali (বাংলা)': {
    title: 'গ্রামীণ টেলিমেডিসিন',
    dashboard: 'স্বাস্থ্যসেবা পোর্টাল ড্যাশবোর্ড',
    teleConsultation: 'টেলি-পরামর্শ কক্ষ',
    teleDesc: 'যাচাইকৃত আঞ্চলিক বা বৈশ্বিক চিকিৎসকদের সাথে নিরাপদে যুক্ত হন।',
    startCall: 'লাইভ কল শুরু করুন',
    vaultTitle: 'নিরাপদ গোপনীয়তা ভল্ট',
    vaultDesc: 'আপনার এনক্রিপ্ট করা প্রেসক্রিপশন, চিকিৎসা সংক্রান্ত নথি এবং ডাক্তারের নির্দেশিকা অ্যাক্সেস করুন।',
    openVault: 'সুরক্ষিত ভল্ট খুলুন',
    settings: 'কর্নার সেটিংস এবং অ্যাকাউন্ট',
    settingsDesc: 'ভাষা অনুবাদ, পাঠ্য আকার এবং লক্ষণগুলি পরিচালনা করুন।',
    openSettings: 'সেটিংস খুলুন ⚙️',
    smartDoc: 'স্মার্ট ডাক্তার সুপারিশ',
    smartDocDesc: 'সঠিক বিশেষজ্ঞের সাথে মিল পেতে আপনার পরামর্শের প্রয়োজন নির্বাচন করুন।',
    regularCheckup: 'নিয়মিত / রুটিন চেকআপ',
    longTermCheckup: 'দীর্ঘমেয়াদী / দীর্ঘস্থায়ী যত্ন',
    docDirectory: 'ডাক্তার ডিরেক্টরি',
    nationalDoctors: '🇮🇳 জাতীয় চিকিৎসক',
    intlDoctors: '🌐 আন্তর্জাতিক চিকিৎসক',
    medicineDir: 'প্রয়োজনীয় ওষুধের মূল্য',
    medName: 'ওষুধের নাম',
    category: 'বিভাগ',
    price: 'মূল্য',
    logout: 'লগআউট',
    backToDashboard: 'ড্যাশবোর্ডে ফিরে যান',
    bookAppointment: 'অ্যাপয়েন্টমেন্ট বুক করুন',
  },
  'Hindi (हिन्दी)': {
    title: 'ग्रामीण टेलीमेडिसिन',
    dashboard: 'स्वास्थ्य सेवा पोर्टल डैशबोर्ड',
    teleConsultation: 'टेली-परामर्श कक्ष',
    teleDesc: 'सत्यापित क्षेत्रीय या वैश्विक चिकित्सकों के साथ सुरक्षित रूप से जुड़ें।',
    startCall: 'लाइव कॉल शुरू करें',
    vaultTitle: 'सुरक्षित गोपनीयता वॉल्ट',
    vaultDesc: 'अपने एन्क्रिप्टेड नुस्खे, चिकित्सा दस्तावेज और डॉक्टर के दिशा-निर्देश देखें।',
    openVault: 'सुरक्षित वॉल्ट खोलें',
    settings: 'कॉर्नर सेटिंग्स और खाता',
    settingsDesc: 'भाषा अनुवाद, टेक्स्ट साइज़ और लक्षणों का प्रबंधन करें।',
    openSettings: 'सेटिंग्स खोलें ⚙️',
    smartDoc: 'स्मार्ट डॉक्टर सिफारिश',
    smartDocDesc: 'सही विशेषज्ञ से जुड़ने के लिए अपनी परामर्श आवश्यकता चुनें।',
    regularCheckup: 'नियमित / रूटीन चेकअप',
    longTermCheckup: 'दीर्घकालिक / क्रोनिक केयर',
    docDirectory: 'डॉक्टर निर्देशिका',
    nationalDoctors: '🇮🇳 राष्ट्रीय डॉक्टर',
    intlDoctors: '🌐 अंतर्राष्ट्रीय डॉक्टर',
    medicineDir: 'आवश्यक दवा मूल्य',
    medName: 'दवा का नाम',
    category: 'श्रेणी',
    price: 'मूल्य',
    logout: 'लॉग आउट',
    backToDashboard: 'डैशबोर्ड पर वापस जाएं',
    bookAppointment: 'अपॉइंटमेंट बुक करें',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('English');

  const t = (key) => {
    const currentDict = translations[language] || translations['English'];
    return currentDict[key] || translations['English'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}