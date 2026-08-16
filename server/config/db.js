import mongoose from 'mongoose'

const connectDB = async() => {
    try{
        mongoose.connection.on('connected',() => console.log('Database connected'))
        await mongoose.connect(`${process.env.MONGODB_URI}/quickshow`, {
            // Aggressive serverless optimization for Vercel
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 60000,
            maxPoolSize: 15,
            minPoolSize: 5,
            waitQueueTimeoutMS: 20000,
            retryWrites: true,
            retryReads: true,
            bufferCommands: false  // Don't buffer if no connection
        })
    }
    catch(err){
        console.log(err.message)
    }
}

export default connectDB;