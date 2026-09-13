import Prescription from "../models/Prescription.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
export const createPrescription=async(req,res)=>{
    try{
        if(req.user.role !== "doctor"){
            return res.status(400).json({
                error:"Only doctors can create prescriptions"
            });
        }
        const{
            patient_id,
            disease,
            diagnosis,
            medicines,
            treatment,
            suggestions,
            next_steps,
            notes
        }=req.body;
        if(!patient_id || !disease || !medicines){
            return res.status(400).json({
                error:"Patient,disease and medicine are required"
            });
        }
        const doctor=await Doctor.findById(req.user.id);
        if(!doctor){
            return res.status(404).json({
                error:"Doctor not found"
            });
        }
        const patient=await Patient.findById(patient_id);
        if(!patient){
            return res.status(400).json({
                error:"Patient not found"
            });
        }
        const prescription=await Prescription.create({
            doctor_id:req.user.id,
            patient_id,
            disease,
            diagnosis,
            medicines,
            treatment,
            suggestions,
            next_steps,
            notes
        });
        const prescriptionsDir=path.join(
            process.cwd(),
            "uploads",
            "prescriptions"
        );
        if(!fs.existsSync(prescriptionsDir)){
            fs.mkdirSync(prescriptionsDir,{recursive:true});
        }
        const fileName=`prescription-${prescription._id}.pdf`;
        const filePath=path.join(prescriptionsDir,fileName);
        const doc=new PDFDocument({
            size:"A4",
            margin:50
        });
        const stream=fs.createWriteStream(filePath);
        doc.pipe(stream);
        doc
           .fontSize(22)
           .font("Helvetica-Bold")
           .text("RURAL TELEMEDICINE",{
            align:"center"
           });
        doc
           .moveDown(0.3)
           .fontSize(11)
           .font("Helvetica")
           .text("Electronic Medical Prescription",
            {
                align:"center"
            });
            doc.moveDown();
            doc
               .moveTo(50,doc.y)
               .lineTo(545,doc.y)
               .stroke();
            doc.moveDown();
            doc
               .font("Helvetica")
               .text(`Dr. ${doctor.name || "Doctor"}`);
            doc.moveDown(0.5);
            doc
               .font("Helvetica-Bold")
               .text("PATIENT");
            doc
               .font("Helvetica")
               .text(patient.name);
            doc
               .moveDown(0.5)
               .text(`Date:${new
              Date().toLocaleDateString("en-IN")
               }`);
            doc.moveDown();
            doc
               .fontSize(11)
               .font("Helvetica-Bold")
               .text("Disease:");
            doc
               .font("Helvetica")
               .text(disease|| "N/A");
            doc.moveDown(0.5);
            doc
               .font("Helvetica-Bold")
               .text("Diagnosis");
            doc
               .font("Helvetica")
               .text(diagnosis || "N/A");
            doc.moveDown();
            doc
               .fontSize(14)
               .font("Helvetica-Bold")
               .text("Prescribed Medicines");
            doc.moveDown(0.5);
            doc
               .fontSize(11)
               .font("Helvetica")
               .text(medicines || "N/A");
            doc.moveDown();
            doc
               .fontSize(14)
               .font("Helvetica-Bold")
               .text("Treatment Plan");
            doc.moveDown(0.5);
            doc
               .fontSize(11)
               .font("Helvetica")
               .text(treatment || "N/A");
            doc.moveDown();
            doc
               .fontSize(14)
               .font("Helvetica-Bold")
               .text("Suggestions");
            doc.moveDown(0.5);
            doc 
               .fontSize(11)
               .font("Helvetica")
               .text(suggestions || "N/A");
            doc.moveDown();
            doc
               .fontSize(14)
               .font("Helvetica-Bold")
               .text("Next Steps");
            doc.moveDown(0.5);
            doc
               .fontSize(11)
               .font("Helvetica")
               .text(next_steps || "N/A");
            doc.moveDown();
            if(notes){
                doc
                   .fontSize(14)
                   .font("Helvetica-Bold")
                   .text("Doctor's Notes");
                doc.moveDown(0.5);
                doc
                   .fontSize(11)
                   .font("Helvetica")
                   .text(notes);
            }
            doc.moveDown(2);
            doc
               .fontSize(9)
               .font("Helvetica")
               .text(
                "This prescription was generated electronically through the Rural Telemedicine System",
                {
                    align:"center"
                }
               );
               doc.end();
               await new Promise((resolve,reject)=>{
                stream.on("finish",resolve);
                stream.on("error",reject);
               });
               prescription.pdf_path=filePath;
               await prescription.save();
        return res.status(201).json({
            message:"Prescription created successfully",
            prescription,
            pdf:fileName
        });
    }catch(error){
        console.error("Create prescription error:",error);
        return res.status(500).json({
            error:"Failed to create prescription"
        });
    }
};
export const getPatientPrescription=async(req,res)=>{
    try{
       const prescription=await Prescription.findOne({patient_id:req.user.id})
       .sort({createdAt:-1})
       .populate("doctor_id","name");
       if(!prescription){
        return res.status(400).json({error:"No active prescription found."});
       }
       return res.status(200).json({
        success:true,
        prescription,
       });
    }catch(error){
       console.error("Fetch Prescription error:",error);
       return res.status(500).json({ error:"Server error while fetching prescriptions"});
    }
};
export const downloadPrescriptionPDF=async(req,res)=>{
    try{
      const{id}=req.params;
      const prescription=await Prescription.findById(id);
      if(!prescription){
        return res.status(404).json({
            error:"Prescription record not found"
        });
      }
      if(!prescription.pdf_path || !fs.existsSync(prescription.pdf_path)){
        return res.status(400).json({error:"PDF File not found on server"});
      }
      res.setHeader("Content-Type","application/pdf");
      return res.sendFile(prescription.pdf_path);
    }catch(error){
      console.error("PDF Download error:",error);
      return res.status(500).json({
        error:"Failed to load PDF file."
      });
    }
}