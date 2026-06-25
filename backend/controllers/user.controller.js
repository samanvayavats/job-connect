import { User } from '../models/user.model.js'
import { hashingPassword } from '../utils/bcrypt.js'

const register = async (req, res) => {
    try {
        const body = req.body

        const { userName, email, password } = body

        if ([userName, email, password].some((e) => e?.trim() === "")) {
            return res.status(401).json({
                message: "all the fields are required"
            })
        }

        const isUserExits = await User.findOne({ userName: userName })
        if (isUserExits) {
            return res.status(409).json({
                message: "user already exits , try to login "
            })
        }

        const hashedPassword = await hashingPassword(password)


        const user = await User.create({
            userName: userName,
            email: email,
            password: hashedPassword,
        })

        const userCreated = await User.findOne(User?._id)

        if (!userCreated) {
            return res.status(500).json({
                message: "something went wrong , try to register again"
            })
        }

        return res.status(201).json({
            message: "registered successful",
            user: userCreated
        })

    } catch (error) {
        console.log('error at the time of register ', error)
        return
    }

}

export {
    register
}