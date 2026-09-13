import mongoose from "mongoose";
const medicineSchema=new mongoose.Schema(
    {
        id:{
            type:Number,
            required:true,
            unique:true
        },
        name:{
            type:String,
            required:true,
            trim:true
        },
        category:{
            type:String,
            required:true,
            trim:true
        },
        pack:{
            type:String,
            required:true,
            trim:true
        },
        price:{
            type:Number,
            required:true,
            min:0
        },
        essential:{
            type:Boolean,
            default:false
        },
        rx_required:{
            type:Boolean,
            default:""
        },
        timing:{
            type:String,
            default:""
        }
    },
    {
        timestamps:true
    }
);
const Medicine=mongoose.model("Medicine",medicineSchema);
export default Medicine;