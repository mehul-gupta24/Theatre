import mongoose from 'mongoose'

const bookingSchema = mongoose.Schema({
    user:{type : String, required : true, ref :'User'},
    show:{type : String, required : true, ref :'Show'},
    amount:{type : Number, required : true},
    bookedSeats:{type : Array, required : true},
    isPaid:{type : Boolean, default : false},
    paymentLink:{type : String},
},{timestamps : true})

// Add indexes for serverless performance
bookingSchema.index({ isPaid: 1 });
bookingSchema.index({ user: 1 });
bookingSchema.index({ show: 1 });
bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking;
