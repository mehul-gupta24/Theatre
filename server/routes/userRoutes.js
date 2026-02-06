import express from 'express'
import { protectAdmin } from '../middleware/auth.js';
import { getFavourites, getUserBooking, updateFavourite } from '../controller/userController.js';
import { requireAuth } from "@clerk/express";

const userRouter = express.Router();


userRouter.get('/bookings', getUserBooking)
userRouter.post('/update-favourite', updateFavourite)
userRouter.get('/favourites', getFavourites)
// userRouter.get("/favourites", requireAuth(), getFavourites);

export default userRouter