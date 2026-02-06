import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/bookings.js";
import Show from "../models/Show.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest funtion to save user data to mongodb
const syncUserCreation = inngest.createFunction(
    {id : 'sync-user-from-clerk'},
    {event : 'clerk/user.created'},
    async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const UserData = {
            _id:id,
            name:first_name + ' ' + last_name,
            email: email_addresses[0].email_address,
            image: image_url,
        }
        await User.create(UserData)
    }
)

// Inngest funtion to delete user data to mongodb
const syncUserDeletion = inngest.createFunction(
    {id : 'delete-user-from-clerk'},
    {event : 'clerk/user.deleted'},
    async ({event}) => {
        const {id} = event.data
        await User.findByIdAndDelete(id)
    }
)

// Inngest funtion to update user data to mongodb
const syncUserUpadation = inngest.createFunction(
    {id : 'update-user-from-clerk'},
    {event : 'clerk/user.updated'},
    // async ({event}) => {
    //     const {id} = event.data
    //     await User.findByIdAndDelete(id)
    // }
    async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const UserData = {
            _id:id,
            name:first_name + ' ' + last_name,
            email: email_addresses[0].email_address,
            image: image_url,
        }
        await User.findByIdAndUpdate(id, UserData)
    }
)

//Ingest function to cancel booking and release seats of show after
//  10 min of booking created if payment
//  is not made
const releaseSeatsAndDeleteBooking = inngest.createFunction(
    {id : 'release-seats-delete-booking'},
    {event : "app/checkpayment"},
    async ({event, step}) => {
        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait for 10 minutes', tenMinutesLater);
        await step.run('check-payment-status', async() => {
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId)
            // if payment is not made, release seats and delete booking
            if(!booking.isPaid){
                const show = await Show.findById(booking.show);
                booking.bookedSeats.forEach((seat)=>{
                    delete show.occupiedSeats[seat]
                })
                show.markModified('occupiedSeats')
                await show.save()
                await booking.findByIdAndDelete(bookingId);
            }

        })
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpadation,
    releaseSeatsAndDeleteBooking
];