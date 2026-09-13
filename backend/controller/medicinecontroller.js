import Medicine from "../models/Medicine.js";
export const getMedicines=async(req,res)=>{
    try{
     const medicines=await Medicine.find().sort({medicine_id:1});
     return res.status(200).json(medicines);
    }catch(error){
     console.error("Get medicines error:",error);
     return res.status(500).json({
        error:"Could not load medicines"
     });
    }
};
export const getMedicineById=async(req,res)=>{
    try{
        const {id}=req.params;
        const medicine=await Medicine.findOne({
            medicine_id:Number(id)
        });
        if(!medicine){
            return res.status(400).json({
                error:"Medicine not found"
            });
        }
        return res.status(200).json(medicine);
    } catch(error){
        console.error("Get medicine error:",error);
        return res.status(500).json({
            error:"Could not load medicine"
        });
    }
};
export const createMedicine=async(req,res)=>{
    try{
        const{
            medicine_id,
            name,
            category,
            pack,
            price,
            essential,
            rx_required,
            timing,
            description,
            stock,
            image_url
        }=req.body;
        if(
            medicine_id === undefined ||
            !name ||
            !category ||
            price === undefined
        ) {
            return res.status(400).json({
                error:"Medicine ID,name,category and price are required"
            });
        }
        const existingMedicine=await Medicine.findOne({
            medicine_id:Number(medicine_id)
        });
        if(existingMedicine){
            return res.status(409).json({
                error:"Medicine with this ID already exists"
            });
        }
        const medicine=await Medicine.create({
            medicine_id:Number(medicine_id),
            name,
            category,
            pack:pack || "",
            price:Number(price),
            essential:essential || false,
            rx_required:rx_required || false,
            timing:timing || "",
            description:description || "",
            stock:stock || 0,
            image_url:image_url || ""
        });
        return res.status(200).json({
            message:"Medicine added successfully",
            medicine
        });
    } catch(error){
        console.error("Create medicine error:",error);
        return res.status(500).json({
            error:"Server error while adding medicine"
        });
    }
};
export const updateMedicine=async(req,res)=>{
    try{
        const {id}=req.params;
        const medicine=await Medicine.findOne({
           medicine_id:Number(id) 
        });
        if(!medicine){
            return res.status(404).json({
                error:"Medicine not found"
            });
        }
        Object.assign(medicine,req.body);
        await medicine.save();
        return res.status(200).json({
            message:"Medicine updated successfully",
            medicine
        });
    } catch(error){
        console.error("Update medicine error:",error);
        return res.status(500).json({
            error:"Server error while updating medicine"
        });
    }
};
export const deleteMedicine=async(req,res)=>{
    try{
      const {id}=req.params;
      const medicine=await Medicine.findOneAndDelete({
        medicine_id:Number(id)
      });
      if(!medicine){
        return res.status(400).json({
            error:"Medicine not found"
        });
      }
      return res.status(200).json({
        message:"Medicine deleted successfully"
      });
    }catch(error){
      console.error("Delete medicine error:",error);
      return res.status(500).json({
        error:"Server error while deleting medicine"
      });
    }
};