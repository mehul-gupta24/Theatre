import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js';
import { clerkClient, clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import { stripeWebhooks } from './controller/stripeWebhooks.js';
// import Movie from './models/Movie.js';
// import Show from './models/Show.js';


const app = express();
const PORT = 3000;

await connectDB();

//stripe Webhook routes
app.use('/api/stripe',express.raw({type: 'application/json'}), stripeWebhooks)

//middleware
app.use(clerkMiddleware())
app.use(express.json())
app.use(cors())


app.get('/',(req,res)=>{res.send("Server is Live!")})
app.use('/api/inngest',serve({client : inngest, functions}))
app.use('/api/show',showRouter)
app.use('/api/booking',bookingRouter)
app.use('/api/admin',adminRouter)
app.use('/api/user',userRouter)


// to delete shows and movies
// app.get('/dev/clear-db', async (req,res)=>{
//   await Movie.deleteMany({})
//   await Show.deleteMany({})
//   res.send("DB cleared")
// })

// app.get('/dev/clear-favourites', async (req, res) => {
//   const userId = req.auth().userId;

//   await clerkClient.users.updateUserMetadata(userId, {
//     privateMetadata: { favourites: [] }
//   });

//   res.send("Favourites cleared");
// });




app.listen(PORT,()=>{
    console.log(`Listening at http://localhost:${PORT}`);
})
