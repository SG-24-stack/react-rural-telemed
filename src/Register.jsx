import { useState, useEffect } from 'react';

const Register = () => {
    // 1. Expanded state to hold both patient and doctor data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'patient', // Default role
        specialty: '',
        license_number: '',
        council: '',
        qualification: '',
        hospital_id: '' // Will be set when hospitals load
    });
    
    // State specifically for the file upload
    const [file, setFile] = useState(null);
    
    // State to hold the list of hospitals fetched from the backend
    const [hospitals, setHospitals] = useState([]);

    // Fetch hospitals when the component loads
    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL;
        fetch(`${API_URL}/hospitals`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setHospitals(data);
                    // Default to the first hospital in the list if available
                    if (data.length > 0) {
                        setFormData(prev => ({ ...prev, hospital_id: data[0].id }));
                    }
                }
            })
            .catch(err => console.error("Failed to fetch hospitals:", err));
    }, []);

    // Handle text input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file selection
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // The Fetch Request (Handles both Patient JSON and Doctor FormData)
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const API_URL = import.meta.env.VITE_API_URL;

        try {
            let response;

            if (formData.role === 'doctor') {
                // --- DOCTOR REGISTRATION (FormData with File) ---
                const data = new FormData();
                data.append('name', formData.name);
                data.append('email', formData.email);
                data.append('password', formData.password);
                data.append('specialty', formData.specialty);
                data.append('license_number', formData.license_number);
                data.append('council', formData.council);
                data.append('qualification', formData.qualification);
                data.append('hospital_id', formData.hospital_id);
                if (file) data.append('govt_document', file);

                response = await fetch(`${API_URL}/auth/register-doctor`, {
                    method: 'POST',
                    body: data 
                    // Note: No 'Content-Type' header here! The browser sets the multipart boundary automatically.
                });
            } else {
                // --- PATIENT REGISTRATION (Standard JSON) ---
                const patientData = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'patient'
                };
                
                response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(patientData)
                });
            }

            const data = await response.json();
            
            if (response.ok) {
                alert(`${formData.role === 'doctor' ? 'Doctor' : 'Patient'} registered successfully!`);
                console.log("Success:", data);
            } else {
                alert('Error: ' + (data.error || data.message));
            }
        } catch (error) {
            console.error("Connection failed:", error);
            alert("Could not connect to the backend.");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h2>Register New User</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                {/* Role Selector */}
                <select name="role" value={formData.role} onChange={handleChange} required style={{ padding: '8px' }}>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                </select>

                <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required style={{ padding: '8px' }}/>
                <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required style={{ padding: '8px' }}/>
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={{ padding: '8px' }}/>

                {/* DOCTOR FIELDS - Only visible if role is 'doctor' */}
                {formData.role === 'doctor' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                        <h4 style={{ margin: '0 0 10px 0' }}>Doctor Details</h4>
                        <input type="text" name="specialty" placeholder="Specialty (e.g. Cardiologist)" onChange={handleChange} required style={{ padding: '8px' }} />
                        <input type="text" name="license_number" placeholder="License Number" onChange={handleChange} required style={{ padding: '8px' }} />
                        <input type="text" name="council" placeholder="Medical Council" onChange={handleChange} required style={{ padding: '8px' }} />
                        <input type="text" name="qualification" placeholder="Qualification (e.g. MBBS, MD)" onChange={handleChange} required style={{ padding: '8px' }} />
                        
                        <select name="hospital_id" value={formData.hospital_id} onChange={handleChange} required style={{ padding: '8px' }}>
                            <option value="" disabled>Select Hospital</option>
                            {hospitals.length > 0 ? (
                                hospitals.map(h => (
                                    <option key={h.id} value={h.id}>{h.name}</option>
                                ))
                            ) : (
                                <option value="1">Rural Hospital 1 (Fallback)</option>
                            )}
                        </select>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Govt Issued ID (PDF/JPG/PNG):</label>
                            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} required />
                        </div>
                    </div>
                )}

                <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;