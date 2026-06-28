import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js"

const verifyUser = async (req, res, next) => {

    try {
        const token = req?.cookies?.accessToken 

            if (!token) {
            return res.status(404).json({
                message: "token not found , unauthorized user"
            })
        }

        const verifiedToken = await jwt.verify(token, process.env.access_token_secret)

        if (!verifiedToken) {
            return res.status(401).json({
                message: "token invalid , unauthorized user"
            })
        }

        const user = await User.findById(verifiedToken?._id)

        if (!user) {
            return res.status(404).json({
                message: "user not found , unauthorized user"
            })
        }

        req.user = user
        next()
    } catch (error) {

        if (error.name === "TokenExpiredError") {
            console.warn("Access token expired");
            return res.status(401).json({
                error : error.name,
                message: "Access token expired"
            })
        }

        console.error("JWT verification error:", error.message);

        return res.status(401).json({
            message: "JWT verification failed"
        })
    }
}

export {
    verifyUser
}