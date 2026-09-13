import React, { useState } from 'react';

/**
 * Hospital Registration & Licensing tab.
 * ----------------------------------------
 * Lets hospital staff view/update the facility's official registration
 * details — the information regulators, patients, and MedoNext's
 * verification step all rely on. Grouped into the five categories
 * requested:
 *
 *   1. Ownership and Management
 *   2. Naming Convention
 *   3. Registration and Licensing
 *   4. Digital Verification
 *   5. Location (city/district + state)
 *
 * All state here is local/mock, same convention as the rest of
 * HospitalPortal's tabs — search for `// TODO: connect to backend`
 * when wiring this to a real endpoint (likely something like
 * PUT /api/hospital/profile plus a file upload for the certificate).
 */

const OWNERSHIP_TYPES = ['Government', 'Private', 'Trust / NGO', 'Public-Private Partnership'];
const INDIAN_STATES = [
  'West Bengal', 'Bihar', 'Jharkhand', 'Odisha', 'Assam', 'Uttar Pradesh',
  'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Other',
];

const initialForm = {
  // Ownership and Management
  ownershipType: 'Private',
  ownerName: '',
  contactName: '',
  contactDesignation: '',
  contactPhone: '',
  contactEmail: '',
  // Naming Convention
  legalName: '',
  tradeName: '',
  // Registration and Licensing
  registrationNumber: '',
  issuingAuthority: '',
  licenseValidTill: '',
  accreditationNumber: '',
  // Location
  cityOrDistrict: '',
  state: 'West Bengal',
  pinCode: '',
};

function Field({ label, children, required }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-gray-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  'w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm';

function Section({ title, desc, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-extrabold text-emerald-900">{title}</h3>
      {desc && <p className="text-xs text-gray-500 mt-0.5 mb-4">{desc}</p>}
      {!desc && <div className="mb-4" />}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

export default function HospitalRegistrationTab() {
  const [form, setForm] = useState(initialForm);
  const [certificateFile, setCertificateFile] = useState(null);
  // Verification status is admin/backend-set, not user-editable — shown
  // read-only here. Defaults to 'Pending' until MedoNext verifies the
  // uploaded certificate against the registration number.
  const [verificationStatus] = useState('Pending'); // TODO: connect to backend — read real status from /api/hospital/profile
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    // TODO: connect to backend — PUT /api/hospital/profile with `form`,
    // plus a multipart upload of `certificateFile` to whatever endpoint
    // stores the registration certificate (e.g. POST /api/hospital/profile/certificate).
    await new Promise((resolve) => setTimeout(resolve, 700));

    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Verified: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Rejected: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-extrabold text-emerald-900">Hospital Registration & Licensing</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Keep these details current — they're used for regulatory verification and shown to patients.
          </p>
        </div>
        <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${statusStyles[verificationStatus]}`}>
          Verification: {verificationStatus}
        </span>
      </div>

      <Section title="Ownership and Management">
        <Field label="Ownership Type" required>
          <select value={form.ownershipType} onChange={update('ownershipType')} className={inputClass}>
            {OWNERSHIP_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Owner / Managing Director Name" required>
          <input value={form.ownerName} onChange={update('ownerName')} className={inputClass} placeholder="e.g. Dr. Ramesh Iyer" required />
        </Field>
        <Field label="Authorized Point of Contact" required>
          <input value={form.contactName} onChange={update('contactName')} className={inputClass} placeholder="Full name" required />
        </Field>
        <Field label="Designation">
          <input value={form.contactDesignation} onChange={update('contactDesignation')} className={inputClass} placeholder="e.g. Administrator, Medical Superintendent" />
        </Field>
        <Field label="Contact Phone" required>
          <input type="tel" value={form.contactPhone} onChange={update('contactPhone')} className={inputClass} placeholder="+91 98765 43210" required />
        </Field>
        <Field label="Contact Email" required>
          <input type="email" value={form.contactEmail} onChange={update('contactEmail')} className={inputClass} placeholder="admin@yourhospital.org" required />
        </Field>
      </Section>

      <Section title="Naming Convention">
        <Field label="Registered Legal Name" required>
          <input value={form.legalName} onChange={update('legalName')} className={inputClass} placeholder="As it appears on your registration certificate" required />
        </Field>
        <Field label="Display / Trade Name">
          <input value={form.tradeName} onChange={update('tradeName')} className={inputClass} placeholder="If different from the legal name" />
        </Field>
      </Section>

      <Section title="Registration and Licensing" desc="Under your state's Clinical Establishment Act (or equivalent).">
        <Field label="Hospital Registration Number" required>
          <input value={form.registrationNumber} onChange={update('registrationNumber')} className={inputClass} placeholder="e.g. WB/CE/2024/00231" required />
        </Field>
        <Field label="Issuing Authority" required>
          <input value={form.issuingAuthority} onChange={update('issuingAuthority')} className={inputClass} placeholder="e.g. West Bengal State Health Department" required />
        </Field>
        <Field label="License Valid Till" required>
          <input type="date" value={form.licenseValidTill} onChange={update('licenseValidTill')} className={inputClass} required />
        </Field>
        <Field label="NABH / NABL Accreditation Number">
          <input value={form.accreditationNumber} onChange={update('accreditationNumber')} className={inputClass} placeholder="Optional — adds a verified badge" />
        </Field>
      </Section>

      <Section title="Digital Verification" desc="Upload your registration certificate for MedoNext to verify against the details above.">
        <div className="sm:col-span-2">
          <Field label="Registration Certificate (PDF or image)">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer"
            />
            {certificateFile && (
              <p className="text-[11px] text-gray-500 mt-1">Selected: {certificateFile.name}</p>
            )}
          </Field>
        </div>
      </Section>

      <Section title="Location">
        <Field label="City / District" required>
          <input value={form.cityOrDistrict} onChange={update('cityOrDistrict')} className={inputClass} placeholder="e.g. Bardhaman" required />
        </Field>
        <Field label="State" required>
          <select value={form.state} onChange={update('state')} className={inputClass}>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="PIN Code" required>
          <input value={form.pinCode} onChange={update('pinCode')} maxLength={6} className={inputClass} placeholder="713101" required />
        </Field>
      </Section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-md"
        >
          {isSaving ? 'Saving…' : 'Save Registration Details'}
        </button>
        {saved && <span className="text-xs font-bold text-emerald-700">✓ Saved</span>}
      </div>
    </form>
  );
}