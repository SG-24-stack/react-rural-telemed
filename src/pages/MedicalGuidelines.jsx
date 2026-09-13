import React, { useState } from 'react';
import DoctorPortalBackground from '../components/DoctorPortalBackground';

export default function MedicalGuidelines({ setCurrentPage }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeGuideline, setActiveGuideline] = useState({
    title: 'Management of Hypertension in Primary Care (JNC 8 / WHO Standards)',
    category: 'Cardiology',
    lastUpdated: 'August 2026',
    summary: 'Evidence-based protocols for diagnosing, staging, and initiating pharmacological treatment for primary hypertension in outpatient and rural teleconsultation settings.',
    sections: [
      {
        heading: '1. Blood Pressure Classification',
        content: '• Normal: <120 / <80 mmHg\n• Prehypertension: 120-139 / 80-89 mmHg\n• Stage 1 Hypertension: 140-159 / 90-99 mmHg\n• Stage 2 Hypertension: ≥160 / ≥100 mmHg'
      },
      {
        heading: '2. First-Line Pharmacological Treatment',
        content: 'For non-black patients: Initiate Thiazide diuretics, CCBs (e.g., Amlodipine 5mg), or ACE inhibitors / ARBs (e.g., Telmisartan 40mg). For black patients: CCBs or Thiazide diuretics preferred.'
      },
      {
        heading: '3. Lifestyle Interventions',
        content: 'Recommend dietary sodium restriction (<2g/day sodium), regular aerobic exercise (150 mins/week), DASH diet rich in potassium, and weight management.'
      }
    ]
  });

  // Directory of guidelines
  const guidelinesDirectory = [
    {
      id: 'g-1',
      title: 'Management of Hypertension in Primary Care',
      category: 'Cardiology',
      summary: 'Staging, first-line drug selection, and lifestyle protocols.',
      lastUpdated: 'Aug 2026',
      sections: [
        {
          heading: '1. Blood Pressure Classification',
          content: '• Normal: <120 / <80 mmHg\n• Prehypertension: 120-139 / 80-89 mmHg\n• Stage 1 Hypertension: 140-159 / 90-99 mmHg\n• Stage 2 Hypertension: ≥160 / ≥100 mmHg'
        },
        {
          heading: '2. First-Line Pharmacological Treatment',
          content: 'For non-black patients: Initiate Thiazide diuretics, CCBs (e.g., Amlodipine 5mg), or ACE inhibitors / ARBs (e.g., Telmisartan 40mg).'
        }
      ]
    },
    {
      id: 'g-2',
      title: 'Type-2 Diabetes Outpatient Management & Glycemic Targets',
      category: 'Endocrinology',
      summary: 'HbA1c goals, Metformin initiation, and renal function monitoring.',
      lastUpdated: 'Jul 2026',
      sections: [
        {
          heading: '1. Glycemic Targets',
          content: 'Target HbA1c < 7.0% for most non-pregnant adults. Fasting plasma glucose target: 80-130 mg/dL.'
        },
        {
          heading: '2. Initial Therapy',
          content: 'Metformin is the preferred initial pharmacologic agent, starting at 500mg daily or twice daily with meals, titrated up to 2000mg/day as tolerated.'
        }
      ]
    },
    {
      id: 'g-3',
      title: 'Acute Vector-Borne Fever Triage (Dengue & Malaria)',
      category: 'Infectious Disease',
      summary: 'Platelet count monitoring, warning signs, and fluid resuscitation.',
      lastUpdated: 'Aug 2026',
      sections: [
        {
          heading: '1. Warning Signs of Severe Dengue',
          content: '• Abdominal pain or tenderness\n• Persistent vomiting\n• Clinical fluid accumulation (ascites, pleural effusion)\n• Mucosal bleeding / lethargy'
        },
        {
          heading: '2. Management Protocol',
          content: 'Avoid NSAIDs (Ibuprofen, Aspirin) due to bleeding risk. Use Paracetamol for fever control. Monitor CBC and platelet counts daily during critical phase.'
        }
      ]
    },
    {
      id: 'g-4',
      title: 'Acute Asthma Exacerbation Management in Telehealth',
      category: 'Pulmonology',
      summary: 'Inhaler protocols, SpO2 threshold checks, and emergency referral triggers.',
      lastUpdated: 'Jun 2026',
      sections: [
        {
          heading: '1. Immediate Action',
          content: 'Administer short-acting beta-2 agonist (SABA like Albuterol/Salbutamol) via metered-dose inhaler with spacer (4-8 puffs every 20 minutes for first hour).'
        },
        {
          heading: '2. Emergency Referral Criteria',
          content: 'If SpO2 drops below 92% on room air, patient exhibits speech difficulty, or fails to respond to initial SABA puffs, arrange immediate transport to emergency care.'
        }
      ]
    }
  ];

  const categories = ['All', 'Cardiology', 'Endocrinology', 'Infectious Disease', 'Pulmonology'];

  const filteredGuidelines = guidelinesDirectory.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DoctorPortalBackground>
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header & Navigation */}
      <div className="mb-6">
        <button 
          onClick={() => setCurrentPage('doctor-dashboard')}
          className="text-sm text-emerald-600 font-medium hover:underline mb-1 inline-block"
        >
          &larr; Back to Doctor Command Portal
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Current Medical Guidelines & Clinical Repository</h1>
        <p className="text-slate-600 text-sm">Access evidence-based protocols, treatment algorithms, and clinical reference standards instantly.</p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedCategory === cat 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Guidelines Directory & Search */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col h-[650px]">
          <h2 className="font-semibold text-slate-800 mb-3 text-base">Guidelines Directory</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search protocols or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filteredGuidelines.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveGuideline(item)}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  activeGuideline.title === item.title 
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' 
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{item.category}</span>
                  <span className="text-[11px] text-slate-400">{item.lastUpdated}</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Detailed Guideline Viewer */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col h-[650px] overflow-y-auto">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {activeGuideline.category}
              </span>
              <span className="text-xs text-slate-400">Last Reviewed: {activeGuideline.lastUpdated}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">{activeGuideline.title}</h2>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{activeGuideline.summary}</p>
          </div>

          <div className="space-y-6 flex-1">
            {activeGuideline.sections.map((section, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h4 className="font-bold text-slate-800 text-sm mb-2">{section.heading}</h4>
                <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-6 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[11px] text-slate-400 italic">
              * Guidelines adhere to international clinical governance frameworks.
            </span>
            <button 
              onClick={() => alert('Guideline protocol bookmarked to your clinical shortcuts!')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-4 py-2 rounded-lg transition"
            >
              Bookmark Protocol
            </button>
          </div>
        </div>

      </div>
    </div>
    </DoctorPortalBackground>
  );
}