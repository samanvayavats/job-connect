import mongoose from "mongoose";

const connectdb = async () =>{
    try {
        const dbconnection = await mongoose.connect(`${process.env.database_url}`)
    } catch (error) {
        console.log('the db connection failed')
        process.exit(1)
    }
}

export default connectdb