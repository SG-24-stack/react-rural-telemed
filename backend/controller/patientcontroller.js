import bcrypt from "bcryptjs";
import Patient from "../models/Patient.js";

export const registerPatient = async (req, res) => {
    try {
        console.log("PATIENT REGISTER BODY:",req.body);
        const {
            name,
            details,
            dob,
            gender,
            mobile,
            email,
            password
        } = req.body;

        // Check required fields
        if (!name || !details || !dob || !gender || !mobile || !email || !password) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        // Check if email already exists
        const existingEmail = await Patient.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({
                error: "Email already registered"
            });
        }

        // Check if mobile already exists
        const existingMobile = await Patient.findOne({ mobile });

        if (existingMobile) {
            return res.status(400).json({
                error: "Mobile number already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create patient
        const patient = await Patient.create({
            name,
            details,
            dob,
            gender,
            mobile,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Patient registered successfully",
            patient: {
                id: patient._id,
                name: patient.name,
                email: patient.email,
                mobile: patient.mobile
            }
        });

    } catch (error) {
        console.error("Patient registration error:", error);

        res.status(500).json({
            error: "Server error during patient registration"
        });
    }
};
export const getAllPatients=async(req,res)=>{
    try{
      const patients=await Patient.find().select("-password").sort({createdAt:-1});
      res.status(200).json({
        patients
      })
    }catch(error){
      console.error("Get patients error:",error);
      res.status(500).json({
        error:"Failed to fetch patients"
      });
    }
}