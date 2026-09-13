import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../constants/api';
const OWNERSHIP_TYPES = ['Government', 'Private', 'Trust / NGO', 'Public-Private Partnership'];
const INDIAN_STATES = [
  'West Bengal', 'Bihar', 'Jharkhand', 'Odisha', 'Assam', 'Uttar Pradesh',
  'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Other',
];
const initialForm = {
  ownershipType: 'Private',
  ownerName: '',
  contactName: '',
  contactDesignation: '',
  contactPhone: '',
  contactEmail: '',
  password:'',
  legalName: '',
  tradeName: '',
  registrationNumber: '',
  issuingAuthority: '',
  licenseValidTill: '',
  accreditationNumber: '',
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
export default function HospitalRegister({ setCurrentPage }) {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState(initialForm);
  const [certificateFile, setCertificateFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const hospitalData=new FormData();
      hospitalData.append('ownershipType',form.ownershipType);
      hospitalData.append('ownerName',form.ownerName);
      hospitalData.append('contactName',form.contactName);
      hospitalData.append('contactDesignation',form.contactDesignation);
      hospitalData.append('contactPhone',form.contactPhone);
      hospitalData.append('contactEmail',form.contactEmail);
      hospitalData.append('password',form.password);
      hospitalData.append('legalName',form.legalName);
      hospitalData.append('tradeName',form.tradeName);
      hospitalData.append('registrationNumber',form.registrationNumber);
      hospitalData.append('issuingAuthority',form.issuingAuthority);
      hospitalData.append('licenseValidTill',form.licenseValidTill);
      hospitalData.append('accreditationNumber',form.accreditationNumber);
      hospitalData.append('cityOrDistrict',form.cityOrDistrict);
      hospitalData.append('state',form.state);
      hospitalData.append('pinCode',form.pinCode);
      if(certificateFile){
        hospitalData.append('certificate',certificateFile);
      }
      await api.post('/hospitals/register',hospitalData,{
        headers:{
          'Content-Type':'multipart/form-data',
        }
      });
      alert('Hospital account created! Please sign in with your new credentials.');
      setCurrentPage('hospital-login');
    } catch (err) {
      console.error(err);
      const backendMsg = err?.response?.data?.error;
      setErrorMsg(backendMsg || 'Registration failed. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 px-4 py-10">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5">
        <div className="text-center mb-2">
          <div className="text-3xl mb-2">🏥</div>
          <h1 className="text-xl font-extrabold text-white">Register Your Hospital</h1>
          <p className="text-sm text-emerald-100 mt-1">Join the MedoNext network</p>
        </div>

        {errorMsg && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {errorMsg}
          </div>
        )}

        <Section title="Account Credentials" desc="Used to sign in to the hospital portal.">
          <Field label="Contact Email (used as login)" required>
            <input type="email" value={form.contactEmail} onChange={update('contactEmail')} className={inputClass} placeholder="admin@yourhospital.org" required />
          </Field>
          <Field label="Password" required>
            <input type="password" value={form.password} onChange={update('password')} className={inputClass} placeholder="••••••••" required minLength={6} />
          </Field>
        </Section>

        <Section title="Ownership and Management">
          <Field label="Ownership Type" required>
            <select value={form.ownershipType} onChange={update('ownershipType')} className={inputClass}>
              {OWNERSHIP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Owner / Managing Director Name" required>
            <input value={form.ownerName} onChange={update('ownerName')} className={inputClass} placeholder="e.g. Dr. Ramesh Iyer" required />
          </Field>
          <Field label="Authorized Point of Contact" required>
            <input value={form.contactName} onChange={update('contactName')} className={inputClass} placeholder="Full name" required />
          </Field>
          <Field label="Designation">
            <input value={form.contactDesignation} onChange={update('contactDesignation')} className={inputClass} placeholder="e.g. Administrator" />
          </Field>
          <Field label="Contact Phone" required>
            <input type="tel" value={form.contactPhone} onChange={update('contactPhone')} className={inputClass} placeholder="+91 98765 43210" required />
          </Field>
        </Section>

        <Section title="Naming Convention">
          <Field label="Registered Legal Name" required>
            <input value={form.legalName} onChange={update('legalName')} className={inputClass} placeholder="As per registration certificate" required />
          </Field>
          <Field label="Display / Trade Name">
            <input value={form.tradeName} onChange={update('tradeName')} className={inputClass} placeholder="If different from legal name" />
          </Field>
        </Section>

        <Section title="Registration and Licensing">
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
            <input value={form.accreditationNumber} onChange={update('accreditationNumber')} className={inputClass} placeholder="Optional" />
          </Field>
        </Section>

        <Section title="Digital Verification" desc="Upload your registration certificate.">
          <div className="sm:col-span-2">
            <Field label="Registration Certificate (PDF or image)">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer"
              />
              {certificateFile && <p className="text-[11px] text-gray-500 mt-1">Selected: {certificateFile.name}</p>}
            </Field>
          </div>
        </Section>

        <Section title="Location">
          <Field label="City / District" required>
            <input value={form.cityOrDistrict} onChange={update('cityOrDistrict')} className={inputClass} placeholder="e.g. Bardhaman" required />
          </Field>
          <Field label="State" required>
            <select value={form.state} onChange={update('state')} className={inputClass}>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="PIN Code" required>
            <input value={form.pinCode} onChange={update('pinCode')} maxLength={6} className={inputClass} placeholder="713101" required />
          </Field>
        </Section>

        <div className="flex flex-col items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-emerald-900 font-bold text-sm px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account…' : 'Register Hospital'}
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage('hospital-login')}
            className="text-xs text-emerald-100 hover:text-white"
          >
            ← Back to Hospital Login
          </button>
        </div>
      </form>
    </div>
  );
}