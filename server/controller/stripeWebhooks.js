import stripe from 'stripe'
import { inngest } from "../inngest/index.js";
import Booking from '../models/bookings.js';
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks = async (req, res) => {
    const sig = req.headers["stripe-signature"]

    let event;
    try {
        event = stripeInstance
        .webhooks
        .constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)

    } catch (error) {
        return res.status(400).send(`Webhook error ${error.message}`)
    }
    try {
        switch (event.type) {
            case "checkout.session.completed":{
                const session = event.data.object;
                const { bookingId } = session.metadata;
                if (!bookingId) break;

                const booking = await Booking.findById(bookingId);
                if (!booking || booking.isPaid) break;


                await Booking.findByIdAndUpdate(bookingId, {
                    isPaid: true,
                    paymentLink: ""
                });

                await inngest.send({
                    name: "app/show.booked",
                    data: { bookingId }
                });

                break;
            }
            default:
            console.log('Unhandled event type : ', event.type);
        }
        res.json({received : true})
    } catch (error) {
        console.log('Webhook processing error : ', error);
        res.status(500).send(`Internal Server Error`)
    }
}