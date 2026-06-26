import { User } from '../models/user.model.js'
import { hashingPassword } from '../utils/bcrypt.js'
import { uploadImageOnCloudinary } from '../utils/cloudinary.js'
import { deleteFile } from '../utils/filehandler.js'
const register = async (req, res) => {
    try {
        const body = req.body

        const { userName, email, password } = body
        const avatarPath = req.file.path

        if ([userName, email, password].some((e) => e?.trim() === "")) {
            return res.status(401).json({
                message: "all the fields are required"
            })
        }

        if (!avatarPath) {
            return res.status(401).json({
                message: "avatar is required"
            })
        }

        const isUserExits = await User.findOne({ userName: userName })

        if (isUserExits) {
            return res.status(409).json({
                message: "user already exits , try to login "
            })
        }

        const uploadAvatar = await uploadImageOnCloudinary(avatarPath, `${userName}avatar`)

        if (!uploadAvatar) {
            return res.status(401).json({
                message: "avatar upload failed "
            })
        }

        const hashedPassword = await hashingPassword(password)

        const user = await User.create({
            userName: userName,
            email: email,
            password: hashedPassword,
            avatar: uploadAvatar.secure_url
        })

        const userCreated = await User.findOne(User?._id).select("-password")

        if (!userCreated) {
            return res.status(500).json({
                message: "something went wrong , try to register again"
            })
        }

        const deletingUplaodedFileFromThePublicFolder = await deleteFile(avatarPath)


        return res.status(201).json({
            message: "registered successful",
            user: userCreated
        })

    } catch (error) {
        console.log('error at the time of register ', error)
        return res.status(500).json({
            message: "something went wrong , try to register again"
        })
    }

}

export {
    register
}