import express from 'express';
import { getProfile, loginUser, registerUser, updateProfile, bookAppointment, giveRating, listAppointment, bookBed, cancelAppointment, cancelBeds } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);

userRouter.post('/login', loginUser);

userRouter.get('/get-profile', authUser, getProfile);

userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);

userRouter.post('/book-appointment', authUser, bookAppointment);

userRouter.post('/book-bed', authUser, bookBed);

userRouter.post('/rate-appointment', authUser, giveRating);

userRouter.post('/cancel-appointment', authUser, cancelAppointment);

userRouter.post('/cancel-bed', authUser, cancelBeds);

userRouter.get('/appointments', authUser, listAppointment);



export default userRouter;
