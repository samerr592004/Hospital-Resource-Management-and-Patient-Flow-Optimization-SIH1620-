import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import userRouter from './routes/userRoute.js';
import hospitalRouter from './routes/hospitalRoute.js';
import doctorRouter from './routes/doctorRoute.js';


// App config
const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB and Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// API Endpoints
app.use('/api/admin', adminRouter);
app.use('/api/doctor',doctorRouter);
app.use('/api/user',userRouter);
app.use('/api/hospital',hospitalRouter);

// Test route
app.get('/', (req, res) => {
  res.send('API is working');
});

// Start the server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));