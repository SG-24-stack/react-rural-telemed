import React, { useState } from 'react';
const emergencyGuides = {
  snake_bite: {
    label: '🐍 Snake Bite',
    title: 'Snake Bite — Immediate Steps',
    urgency: 'Time-critical — antivenom is time-sensitive',
    color: 'bg-red-50 text-red-800 border-red-200',
    steps: [
      'Keep the person still and calm — movement spreads venom faster through the body.',
      'Keep the bitten limb below heart level and loosely immobilized (like a splint).',
      'Remove rings, watches, or tight clothing near the bite before swelling starts.',
      'Do NOT cut the wound, try to suck out venom, apply ice, or tie a tight tourniquet.',
      'Note the time of the bite and the snake\u2019s appearance if it was seen (don\u2019t try to catch or kill it).',
      'Get to medical care immediately — trigger SOS below if ambulance is delayed.'
    ]
  },
  stroke: {
    label: '🧠 Stroke (F.A.S.T.)',
    title: 'Stroke — F.A.S.T. Check & Immediate Steps',
    urgency: 'Time-critical — treatment window is narrow',
    color: 'bg-purple-50 text-purple-800 border-purple-200',
    steps: [
      'FACE — ask them to smile. Watch for one side drooping.',
      'ARMS — ask them to raise both arms. Watch for one arm drifting down.',
      'SPEECH — ask them to repeat a simple phrase. Listen for slurring.',
      'TIME — if any sign is present, note the exact time symptoms started and treat as an emergency.',
      'If unconscious or vomiting, lay them on their side (recovery position).',
      'Do NOT give food, water, or medication. Keep them calm, still, and warm.'
    ]
  },
  accident: {
    label: '🚑 Major Accident / Trauma',
    title: 'Major Accident / Road Trauma — Immediate Steps',
    urgency: 'Time-critical — control bleeding first',
    color: 'bg-orange-50 text-orange-800 border-orange-200',
    steps: [
      'Check the scene is safe before approaching (traffic, fire, live wires).',
      'Do not move the person unless there is immediate danger — risk of spinal injury.',
      'Check breathing and responsiveness first.',
      'Control heavy bleeding with firm, direct pressure using clean cloth.',
      'If an object is impaled in a wound, do NOT remove it — pack around it and stabilize.',
      'Keep them warm and still. If unconscious but breathing, place in the recovery position.'
    ]
  }
};

export default function EmergencySOS() {
  const [selectedEmergencyGuide, setSelectedEmergencyGuide] = useState('');
  const [sosActive, setSosActive] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState(null);

  const handleEmergencyGuideSelect = (key) => {
    setSelectedEmergencyGuide(key);
  };

  // Emergency SOS GPS Dispatcher
  const handleTriggerSOS = () => {
    setSosActive(true);
    setGpsCoordinates(null);
    if (!navigator.geolocation) {
      setGpsCoordinates({ error: 'Location services are not supported by this browser.' });
      setSosActive(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude=position.coords.latitude;
        const longitude=position.coords.longitude;
        try{
          const response=await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          );
          if(!response.ok){
            throw new Error("Failed to get address");
          }
          const data=await response.json();
          setGpsCoordinates({
            lat:`${latitude.toFixed(6)}°`,
            lng:`${longitude.toFixed(6)}°`,
            area: data.display_name || 'Exact address unavailable'
        });
        } catch (error){
          console.error(`Reverse geocoding error:`,error);
          setGpsCoordinates({
            lat:`${latitude.toFixed(6)}°`,
            lng:`${longitude.toFixed(6)}°`,
            area:`Address could not be determined`
          });
        }
        setSosActive(false);
      },
      (error)=>{
        console.error("Unable to get emergency location:",error);
        setGpsCoordinates({
          error:"we could not access your location.please allow location permission and try again"
        });
        setSosActive(false);
      },
      {
        enableHighAccuracy:true,
        timeout:10000,
        maximumAge:5000
      }
    );
 };
  return (
    <>
      {/* First Response Guide */}
      <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-sm border border-orange-200">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-3">🩺 First Response Guide</h3>
        <p className="text-xs text-gray-600 mb-4">
          Step-by-step safety actions for the first few minutes of a medical emergency — for use while ambulance or doctor help is on the way.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {Object.entries(emergencyGuides).map(([key, guide]) => (
            <button
              key={key}
              onClick={() => handleEmergencyGuideSelect(key)}
              className={`p-3 rounded-lg border text-xs font-bold transition-all ${
                selectedEmergencyGuide === key
                  ? 'bg-orange-600 text-white border-orange-700'
                  : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
              }`}
            >
              {guide.label}
            </button>
          ))}
        </div>

        {selectedEmergencyGuide && (
          <div className={`p-4 rounded-lg border ${emergencyGuides[selectedEmergencyGuide].color} text-xs animate-fade-in space-y-3`}>
            <div>
              <p className="font-black text-sm mb-0.5">{emergencyGuides[selectedEmergencyGuide].title}</p>
              <p className="font-bold uppercase tracking-wide text-[10px] opacity-80">
                {emergencyGuides[selectedEmergencyGuide].urgency}
              </p>
            </div>

            <ol className="list-decimal list-inside space-y-1.5 font-medium">
              {emergencyGuides[selectedEmergencyGuide].steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>

            <button
              onClick={handleTriggerSOS}
              disabled={sosActive}
              className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-black px-5 py-2.5 rounded-lg shadow-md transition-transform active:scale-95 text-xs tracking-wider"
            >
              {sosActive ? 'Locating GPS Coordinates...' : '🆘 Trigger Emergency SOS Now'}
            </button>

            <p className="text-[10px] text-gray-500 italic pt-1 border-t border-black/5">
              This guidance supports, not replaces, professional emergency care.
            </p>
          </div>
        )}
      </div>

      {/* Emergency SOS & GPS Dispatch */}
      <div className="bg-red-900/5 backdrop-blur p-6 rounded-xl shadow-sm border border-red-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-red-700 mb-1">🚨 Emergency SOS & GPS Dispatch</h3>
            <p className="text-xs text-gray-600">Instantly share precise rural geographical coordinates with regional ambulance dispatchers.</p>
          </div>
          <button
            onClick={handleTriggerSOS}
            disabled={sosActive}
            className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3 rounded-xl shadow-lg transition-transform active:scale-95 text-xs tracking-wider"
          >
            {sosActive ? 'Locating GPS Coordinates...' : '🆘 PRESS FOR EMERGENCY SOS'}
          </button>
        </div>

        {gpsCoordinates && (
          <div className={`mt-4 p-4 bg-white rounded-lg border shadow-inner text-xs space-y-1 animate-fade-in ${gpsCoordinates.error ? 'border-yellow-300' : 'border-red-300'}`}>
            {gpsCoordinates.error ? (
              <p className="font-bold text-yellow-700">⚠ {gpsCoordinates.error}</p>
            ) : (
              <>
                <p className="font-bold text-red-600">✓ Location captured for emergency dispatch</p>
                <p><strong>Coordinates:</strong> {gpsCoordinates.lat}, {gpsCoordinates.lng}</p>
                <p><strong>Location Tag:</strong> {gpsCoordinates.area}</p>
                <p className="text-gray-500 pt-1">The current prototype captures your location; live ambulance dispatch will be connected to the backend in the next integration phase.</p>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
