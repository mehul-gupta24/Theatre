import Booking from "../models/bookings.js"
import Show from "../models/Show.js";
import User from "../models/User.js";

// API to check is user is admin
export const isAdmin = async(req, res) => {
    res.json({success : true, isAdmin : true})
}

//API to get Dashboard data
export const getDashboardData = async(req, res) => {
    try {
        const bookings = await Booking.find({isPaid : true});
        const activeShows = await Show.find({showDateTime : {$gte : new Date()}}).populate('movie');
        const totalUser = await User.countDocuments()
        let totalRevenue = 0;
        for (const booking of bookings) {
        totalRevenue += booking.amount;
        }
        const dashboardData = {
            totalBookings : bookings.length,
            totalRevenue,
            activeShows,
            totalUser
        }
        res.json({success : true, dashboardData})
        
    } catch (err) {
        console.log(err)
        res.json({success : false, message : err.message})
    }
}

//API to get All Shows
export const getAllShows = async(req, res) => {
    try {
        const shows = await Show.find({showDateTime : {$gte : new Date()} })
                                .populate('movie')
                                .sort({showDateTime : 1})
        res.json({success : true, shows})
    } catch (err) {
        console.log(err)
        res.json({success : true, message : err.message})
    }
}

//API to get allBookings
export const getAllBookings = async(req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user').populate({
            path : "show",
            populate : {path : 'movie'}
        }).sort({ createdAt : -1})
        res.json({success : true, bookings})
    } catch (error) {
        console.log(error)
        res.json({success : true, message : error.message})
    }
}
