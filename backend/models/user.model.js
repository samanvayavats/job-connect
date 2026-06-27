import mongoose from "mongoose";
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    email: {
        type: String,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    summary: {
        type: String
    },
    resume: {
        type: String
    },
    avatar: {
        type: String
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true })

userSchema.methods.getRefresehToken =function(){
    return jwt.sign({
        _id: this._id,
        userName: this.userName
    }, process.env.refresh_token_secret, {
        expiresIn: "10d"
    })
}
userSchema.methods.getAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        userName: this.userName
    }, process.env.access_token_secret, {
        expiresIn: "15m"
    })
}

export const User = mongoose.model("User", userSchema)