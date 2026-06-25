import bcrypt from 'bcrypt'

const hashingPassword = async(password) =>{
    return await bcrypt.hash(password , 10)
}

export {
    hashingPassword
}
