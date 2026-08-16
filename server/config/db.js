import mongoose from 'mongoose'

const connectDB = async() => {
    try{
        mongoose.connection.on('connected',() => console.log('Database connected'))
        await mongoose.connect(`${process.env.MONGODB_URI}/quickshow`, {
            // Serverless optimized settings
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 5,
            waitQueueTimeoutMS: 10000,
            retryWrites: true,
            retryReads: true
        })
    }
    catch(err){
        console.log(err.message)
    }
}

export default connectDB;