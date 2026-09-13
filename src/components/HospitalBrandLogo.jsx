export default function HospitalBrandLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Wordmark: "R" + stethoscope-as-"u" + "ral" + "Telemedicine" */}
      <div className="flex items-end">
        <span className="text-3xl font-black text-white tracking-tight">R</span>

        {/* Stethoscope forming the "u" */}
        <svg
          width="26"
          height="34"
          viewBox="0 0 26 34"
          className="mx-0.5 -mb-0.5"
        >
          <path
            d="M4 2 v12 a9 9 0 0 0 18 0 V2"
            fill="none"
            stroke="#facc15"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="4" cy="2" r="2.6" fill="#facc15" />
          <circle cx="22" cy="2" r="2.6" fill="#facc15" />
          <circle cx="22" cy="16" r="3.2" fill="#facc15" />
        </svg>

        <span className="text-3xl font-black text-white tracking-tight">ral</span>
      </div>
      <span className="text-3xl font-light text-white tracking-tight">Telemedicine</span>
    </div>
  );
}