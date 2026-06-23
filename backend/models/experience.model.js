import mongoose, { model } from "mongoose";

const experienceSchema = new mongoose.Schema({
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    jobTitle:{
        type:String,
        required :true
    },
    role:{
        type:String,
        required :true
    },
    description:{
        type:String,
        required :true
    }
},{timestamps:true})

export const Experience = mongoose.model("Experience" , experienceSchema)