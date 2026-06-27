import bcrypt from 'bcrypt'

const hashingPassword = async(password) =>{
    return await bcrypt.hash(password , 10)
}

const verifyPassword = async(password , hashedPassword)=>{
    const result = await bcrypt.compare(password, hashedPassword)
    return result
}
export {
    hashingPassword,
    verifyPassword
}
