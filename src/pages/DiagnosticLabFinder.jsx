import React, { useState } from 'react';

export default function DiagnosticLabFinder({ setCurrentPage }) {
  // State for CHW manual input
  const [selectedTest, setSelectedTest] = useState('');
  const [showRecommendation, setShowRecommendation] = useState(false);

  // Mock Database of Local Diagnostic Centers & Hospitals
  const localLabs = [
    {
      id: 1,
      name: 'Kandi Sub-Divisional Hospital',
      distance: '3.2 km',
      facilities: ['X-Ray', 'ECG', 'Complete Blood Count (CBC)', 'Urine Analysis'],
      type: 'Government',
      cost: 'Free / Subsidized'
    },
    {
      id: 2,
      name: 'LifeCare Diagnostics Kandi',
      distance: '1.5 km',
      facilities: ['Complete Blood Count (CBC)', 'Blood Glucose', 'Lipid Profile', 'Thyroid'],
      type: 'Private',
      cost: 'Standard Rates'
    },
    {
      id: 3,
      name: 'Rural Health Center - Block B',
      distance: '0.8 km',
      facilities: ['Blood Glucose', 'Malaria Rapid Test', 'Urine Analysis'],
      type: 'Community Clinic',
      cost: 'Free'
    }
  ];

  // Logic to filter labs that offer the selected test
  const recommendedLabs = localLabs.filter(lab => 
    selectedTest ? lab.facilities.includes(selectedTest) : false
  );

  // Logic to generate patient preparation instructions based on the test
  const getTestInstructions = (test) => {
    switch (test) {
      case 'Blood Glucose':
        return 'Fasting is required. Do not eat or drink anything (except water) for 8-10 hours before the test. Visit the lab early in the morning.';
      case 'X-Ray':
        return 'No fasting required. Please wear loose, comfortable clothing without metal zippers or buttons. Bring previous medical records if any.';
      case 'Complete Blood Count (CBC)':
        return 'No special preparation needed. Can be done at any time of the day. Stay hydrated.';
      default:
        return 'Please carry your Aadhaar card and the doctor\'s prescription (photo or physical copy) to the center.';
    }
  };

  const handleGeneratePlan = () => {
    if (selectedTest) {
      setShowRecommendation(true);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-2 space-y-6">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center bg-white/90 backdrop-blur p-4 rounded-xl shadow-sm border border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-900">🔬 Diagnostic & Lab Router</h1>
          <p className="text-xs text-gray-600">Manually select prescribed tests to generate an optimized patient action plan.</p>
        </div>
        <button 
          onClick={() => setCurrentPage('dashboard')} 
          className="text-sm font-bold text-gray-600 hover:text-gray-900 underline"
        >
          &larr; Back to Dashboard
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: CHW Data Entry & Test Selection */}
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-md font-bold text-gray-800 border-b pb-3 mb-4">📝 Health Worker Entry Form</h3>
            
            {/* Vitals Quick-Log (Visual representation of your requirement) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              <input type="text" placeholder="Blood Pressure (e.g., 120/80)" className="p-2 border rounded text-xs w-full focus:ring-1 focus:ring-blue-500" />
              <input type="text" placeholder="SpO2 (%)" className="p-2 border rounded text-xs w-full focus:ring-1 focus:ring-blue-500" />
              <input type="text" placeholder="Temp (°F)" className="p-2 border rounded text-xs w-full focus:ring-1 focus:ring-blue-500" />
              <input type="text" placeholder="Weight (kg)" className="p-2 border rounded text-xs w-full focus:ring-1 focus:ring-blue-500" />
              <input type="text" placeholder="Symptoms Duration" className="p-2 border rounded text-xs w-full focus:ring-1 focus:ring-blue-500" />
            </div>

            {/* Test Selection (Bypassing Photo OCR) */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <label className="block text-sm font-bold text-blue-900 mb-2">
                Select Prescribed Test (From Doctor's Note/Photo):
              </label>
              <select 
                className="w-full p-2.5 border rounded-lg text-sm bg-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedTest}
                onChange={(e) => {
                  setSelectedTest(e.target.value);
                  setShowRecommendation(false); // Reset on new selection
                }}
              >
                <option value="">-- Select Required Test --</option>
                <option value="Blood Glucose">Blood Glucose (Fasting/PP)</option>
                <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
                <option value="X-Ray">X-Ray Imaging</option>
                <option value="Urine Analysis">Routine Urine Analysis</option>
              </select>

              <button 
                onClick={handleGeneratePlan}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm shadow transition-transform active:scale-95"
              >
                Find Nearest Centers & Generate Plan
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Generated Action Plan */}
        {showRecommendation ? (
          <div className="space-y-6 animate-fade-in">
            
            {/* Step 1: What to do */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-sm border border-orange-200">
              <h3 className="text-md font-black text-orange-800 mb-2 flex items-center gap-2">
                ⚠️ Step 1: Preparation Instructions
              </h3>
              <p className="text-sm text-orange-900 font-medium">
                {getTestInstructions(selectedTest)}
              </p>
            </div>

            {/* Step 2: Where to go */}
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
              <h3 className="text-md font-black text-gray-800 mb-4 flex items-center gap-2">
                📍 Step 2: Nearest Recommended Centers
              </h3>
              
              {recommendedLabs.length > 0 ? (
                <div className="space-y-4">
                  {recommendedLabs.map((lab) => (
                    <div key={lab.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-gray-900 text-sm">{lab.name}</h4>
                        <span className="text-xs font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          {lab.distance}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{lab.type} • {lab.cost}</p>
                      <button className="w-full mt-2 bg-green-100 hover:bg-green-200 text-green-800 border border-green-300 font-bold py-2 rounded text-xs transition-colors">
                        Send Location to Patient via SMS
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-red-600 font-bold">No centers nearby currently support this specific test. Please arrange transport to the district hospital.</p>
              )}
            </div>

          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200 border-dashed flex items-center justify-center text-center h-full min-h-[300px]">
            <p className="text-gray-400 font-medium text-sm">
              Select a test and generate a plan to see <br/> recommended laboratories and patient instructions here.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}