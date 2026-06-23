import mongoose from "mongoose";


const jobSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required : true,
    },
    experienceRequired:{
        type:String,
        required : true,
    },
    companyName:{
        type:String,
        required : true,
    },
    description:{
        type:String,
        required : true,
    }
},{timestamps:true})

export const Job = mongoose.model("Job" , jobSchema) 