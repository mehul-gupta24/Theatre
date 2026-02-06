import { clerkClient } from "@clerk/express";
import Booking from "../models/bookings.js";
import Movie from "../models/Movie.js";

// API controller function to get user bookings
export const getUserBooking = async(req, res) => {
    try {
        const {userId} = req.auth();
        const bookings = await Booking.find({user : userId}).populate({
            path : 'show',
            populate : { path : 'movie'}
        }).sort({createdAt : -1})
        res.json({success : true, bookings})
    } catch (error) {
        console.log(error);
        res.json({success : true, message: error.message})
    }
}

// API controller function to update favourite movie in clerk user Metadata
export const updateFavourite = async(req,res) => {
    try {
        const userId = req.auth().userId;
        const {movieId} = req.body;
        const user = await clerkClient.users.getUser(userId);

        if(!user.privateMetadata.favourites){
            user.privateMetadata.favourites = [];
        }

        if(!user.privateMetadata.favourites.includes(movieId)){
            user.privateMetadata.favourites.push(movieId);
        }
        else{
            //if its there than remove it
            user.privateMetadata.favourites = user.
                                              privateMetadata.
                                              favourites.
                                              filter((movie) => movie != movieId)
        }

        await clerkClient.users.updateUserMetadata(
            userId,
            {privateMetadata : user.privateMetadata}
        )
        res.json({success : true, message : "Favourite movie Updated"})

    } catch (error) {
        console.log(error);
        res.json({success : false, message: error.message})
        
    }
}

// API controller function to update favourite movie in clerk user Metadata
export const getFavourites = async(req,res) => {
    try {
        const userId = req.auth().userId;
        const user = await clerkClient.users.getUser(userId);
        const favourites = user.privateMetadata.favourites;
        // getting movies 
        const movies = await Movie.find({_id : {$in : favourites}});
        res.json({success : true, movies});
    } catch (error) {
        console.log(error);
        res.json({success : false, message: error.message})
    }
}