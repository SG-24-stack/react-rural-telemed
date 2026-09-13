import React, { useState, useRef, useEffect } from 'react';

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const HOSPITALS = [
  { id: 1, name: 'Primary Health Centre - Block A', address: 'Village Block A, Rural Zone', district: 'Murshidabad, West Bengal', scheme: 'Ayushman Bharat', lat: 24.0830, lng: 88.1500, facilities: ['General Medicine', 'Maternity', 'Vaccination'], beds: 12, contact: '03482-XXXXXX' },
  { id: 2, name: 'Community Rural Hospital - Block B', address: 'Main Road, Block B', district: 'Murshidabad, West Bengal', scheme: 'Swasthya Sathi', lat: 24.1300, lng: 88.2700, facilities: ['General Medicine', 'Orthopedics', 'Pediatrics', 'Emergency'], beds: 30, contact: '03482-XXXXXX' },
  { id: 3, name: 'Telemedicine Sub-Center - Block C', address: 'Market Complex, Block C', district: 'Murshidabad, West Bengal', scheme: 'National Health Mission', lat: 23.9500, lng: 88.1000, facilities: ['General Medicine', 'Tele-Consultation', 'Vaccination'], beds: 6, contact: '03482-XXXXXX' },
  { id: 4, name: 'District Hospital - Berhampore', address: 'Berhampore Town', district: 'Murshidabad, West Bengal', scheme: 'Ayushman Bharat', lat: 24.1005, lng: 88.2530, facilities: ['General Medicine', 'Cardiology', 'Orthopedics', 'Maternity', 'Emergency', 'Surgery'], beds: 150, contact: '03482-XXXXXX' },
  { id: 5, name: 'Sub-Divisional Hospital - Lalbagh', address: 'Lalbagh Court Road', district: 'Murshidabad, West Bengal', scheme: 'Swasthya Sathi', lat: 24.1730, lng: 88.2670, facilities: ['General Medicine', 'Dermatology', 'Ophthalmology', 'Dentistry', 'Pediatrics'], beds: 60, contact: '03482-XXXXXX' },
  { id: 6, name: 'Kandi Sub-Divisional Hospital', address: 'Kandi Town', district: 'Murshidabad, West Bengal', scheme: 'Ayushman Bharat', lat: 23.9490, lng: 88.0330, facilities: ['General Medicine', 'Cardiology', 'Emergency', 'Maternity'], beds: 100, contact: '03482-XXXXXX' }
];

const SYMPTOM_KEYWORDS = {
  'General Medicine': ['fever', 'cold', 'cough', 'flu', 'body ache', 'headache', 'weakness'],
  Cardiology: ['chest pain', 'heart', 'palpitation', 'bp', 'blood pressure', 'cardiac'],
  Orthopedics: ['fracture', 'bone', 'joint', 'back pain', 'sprain', 'knee'],
  Pediatrics: ['child', 'baby', 'infant', 'kid'],
  Maternity: ['pregnan', 'delivery', 'labour', 'labor', 'antenatal'],
  Dermatology: ['skin', 'rash', 'itch', 'acne'],
  Ophthalmology: ['eye', 'vision', 'sight'],
  Dentistry: ['tooth', 'teeth', 'dental', 'gum'],
  Emergency: ['emergency', 'accident', 'bleeding', 'urgent', 'critical'],
  Surgery: ['surgery', 'operation'],
};

function matchFacilities(queryText) {
  const q = queryText.toLowerCase();
  const matched = new Set();
  Object.entries(SYMPTOM_KEYWORDS).forEach(([facility, keywords]) => {
    if (keywords.some((kw) => q.includes(kw))) matched.add(facility);
  });
  return matched;
}

export default function HospitalFinder({ setCurrentPage }) {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hi! Tell me your symptoms or what kind of care you need, and share your location, and I'll find the nearest hospitals or clinics for you." }
  ]);
  const [queryInput, setQueryInput] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);

  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');

  const [results, setResults] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef(null);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQueryInput((prev) => (prev ? prev + ' ' + transcript : transcript));
    };
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      addMessage('ai', "Voice input didn't come through, please try again or type your symptoms instead.");
    };
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
  }, []);

  const addMessage = (sender, text, meta) => {
    setMessages((prev) => [...prev, { sender, text, meta }]);
  };

  const handleToggleRecording = () => {
    if (!voiceSupported || !recognitionRef.current) {
      addMessage('ai', "Voice input isn't supported in this browser. Try Chrome on desktop or Android, or just type your symptoms.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setAttachedFile(file);
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      addMessage('ai', "Your browser doesn't support location sharing. You can still search, results just won't be sorted by distance.");
      return;
    }
    setLocationStatus('requesting');
    addMessage('ai', 'Requesting your location...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setLocationStatus('granted');
        addMessage('ai', 'Got your location (accurate to ~' + Math.round(pos.coords.accuracy) + 'm). I will now sort results by real distance from you.');
      },
      (err) => {
        console.error('Geolocation error:', err);
        setLocationStatus('denied');
        addMessage('ai', "Couldn't access your location (permission denied or unavailable). You can still search, results just won't be sorted by distance.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = queryInput.trim();
    if (!query && !attachedFile) return;

    addMessage('user', query || '(sent an attachment)', attachedFile ? { fileName: attachedFile.name } : undefined);
    setQueryInput('');
    const hadFile = !!attachedFile;
    removeAttachedFile();
    setHasSearched(true);

    const matchedFacilities = matchFacilities(query);

    setTimeout(() => {
      let candidates = HOSPITALS.map((h) => {
        const facilityMatch = matchedFacilities.size === 0
          ? true
          : h.facilities.some((f) => matchedFacilities.has(f));
        const distanceKm = userLocation
          ? haversineDistanceKm(userLocation.lat, userLocation.lng, h.lat, h.lng)
          : null;
        return Object.assign({}, h, { facilityMatch, distanceKm });
      });

      candidates.sort((a, b) => {
        if (a.facilityMatch !== b.facilityMatch) return a.facilityMatch ? -1 : 1;
        if (a.distanceKm != null && b.distanceKm != null) return a.distanceKm - b.distanceKm;
        return a.name.localeCompare(b.name);
      });

      const top = candidates.slice(0, 5);
      setResults(top);
      setSelectedHospital(top[0] || null);

      const matchedNames = Array.from(matchedFacilities).join(', ');
      const summary = matchedFacilities.size > 0
        ? 'Based on "' + query + '", I matched facilities offering: ' + matchedNames + '.'
        : query
          ? 'I could not tie "' + query + '" to a specific specialty, so here are the nearest general facilities.'
          : 'Got your attachment, here are the nearest general facilities while a doctor reviews it.';
      const distanceNote = userLocation
        ? ' Sorted by distance from your shared location.'
        : ' Share your location above for distance-sorted results.';
      const fileNote = hadFile ? ' Your attachment has been noted for the reviewing doctor.' : '';

      addMessage('ai', summary + distanceNote + fileNote + ' Found ' + top.length + ' matching facilities, see the list below.');
    }, 500);
  };

  const osmEmbedUrl = (hospital) => {
    const delta = 0.02;
    const bbox = [
      hospital.lng - delta,
      hospital.lat - delta,
      hospital.lng + delta,
      hospital.lat + delta,
    ].join('%2C');
    return 'https://www.openstreetmap.org/export/embed.html?bbox=' + bbox + '&layer=mapnik&marker=' + hospital.lat + '%2C' + hospital.lng;
  };

  const osmFullMapUrl = (hospital) => {
    return 'https://www.openstreetmap.org/?mlat=' + hospital.lat + '&mlon=' + hospital.lng + '#map=15/' + hospital.lat + '/' + hospital.lng;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-4 space-y-6 animate-fade-in font-sans">

      <div className="bg-gradient-to-r from-blue-700 via-teal-700 to-emerald-700 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black">AI Hospital & Clinic Finder</h1>
          <p className="text-xs text-blue-100 mt-1">Tell us your symptoms, share your location, and find the nearest care, with real distances and an interactive map.</p>
        </div>
        {setCurrentPage && (
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow shrink-0"
          >
            Back to Dashboard
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[560px]">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-gray-800 text-sm">AI Care Assistant</h3>
            <button
              onClick={handleShareLocation}
              disabled={locationStatus === 'requesting'}
              className={
                'text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ' +
                (locationStatus === 'granted'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200')
              }
            >
              {locationStatus === 'granted' ? 'Location Shared' : locationStatus === 'requesting' ? 'Locating...' : 'Share My Location'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  'p-3 rounded-2xl text-sm max-w-[85%] ' +
                  (msg.sender === 'user'
                    ? 'bg-blue-600 text-white ml-auto rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 mr-auto rounded-bl-sm')
                }
              >
                {msg.text}
                {msg.meta && msg.meta.fileName && (
                  <div className={'mt-1.5 flex items-center gap-1.5 text-xs ' + (msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500')}>
                    Attached: {msg.meta.fileName}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {attachedFile && (
            <div className="px-3 pt-2">
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 text-xs">
                <span className="text-blue-800 font-bold truncate">
                  Attached: {attachedFile.name}
                </span>
                <button
                  type="button"
                  onClick={removeAttachedFile}
                  className="text-blue-600 hover:text-blue-900 font-black ml-2 shrink-0"
                  aria-label="Remove attachment"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSearch} className="p-3 border-t border-gray-100 flex gap-2 items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              title="Attach a photo or document"
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors text-sm font-bold"
            >
              File
            </button>

            <button
              type="button"
              onClick={handleToggleRecording}
              title={isRecording ? 'Stop recording' : 'Speak your symptoms'}
              className={
                'shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-colors text-sm font-bold ' +
                (isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 hover:bg-gray-200 text-gray-600')
              }
            >
              Mic
            </button>

            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder={isRecording ? 'Listening...' : 'e.g. chest pain, need cardiology...'}
              className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 min-w-0"
            />
            <button
              type="submit"
              className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow transition-transform active:scale-95"
            >
              Send
            </button>
          </form>
        </div>

        <div className="space-y-4">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-black text-gray-800 text-sm border-b border-gray-100 pb-3 mb-3">
              Nearest Matching Facilities {results.length > 0 && '(' + results.length + ')'}
            </h3>

            {!hasSearched && (
              <p className="text-sm text-gray-400 py-6 text-center">Describe your symptoms in the chat to see nearby facilities here.</p>
            )}

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {results.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHospital(h)}
                  className={
                    'w-full text-left p-3 rounded-xl border transition-all ' +
                    (selectedHospital && selectedHospital.id === h.id
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-100'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300')
                  }
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{h.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{h.address}, {h.district}</p>
                    </div>
                    {h.distanceKm != null && (
                      <span className="bg-blue-100 text-blue-800 text-[11px] font-black px-2 py-1 rounded-full whitespace-nowrap">
                        {h.distanceKm < 1 ? Math.round(h.distanceKm * 1000) + ' m' : h.distanceKm.toFixed(1) + ' km'}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {h.facilities.map((f) => (
                      <span key={f} className="bg-white border border-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1.5">{h.beds} beds, {h.scheme}</p>
                </button>
              ))}
            </div>
          </div>

          {selectedHospital && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-black text-gray-800 text-sm border-b border-gray-100 pb-3 mb-3">
                {selectedHospital.name}
              </h3>
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <iframe
                  title={'map-' + selectedHospital.id}
                  width="100%"
                  height="260"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={osmEmbedUrl(selectedHospital)}
                  allowFullScreen
                />
              </div>
              <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                <span>{selectedHospital.contact}</span>
                <a href={osmFullMapUrl(selectedHospital)} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">Open larger map</a>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-[11px] text-gray-400 text-center">
        Hospital data shown is currently a local demo directory. Symptom matching is keyword-based, not a medical diagnosis, always consult a doctor for urgent or serious symptoms.
      </p>
    </div>
  );
}