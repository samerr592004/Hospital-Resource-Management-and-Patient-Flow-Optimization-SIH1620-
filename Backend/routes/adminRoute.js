import express from 'express';
import { addDoctor, addHospital, allDoctors, allHospitals, loginAdmin ,getDoctorByHospital} from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvilability } from '../controllers/doctorController.js';

const adminRouter = express.Router();

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);
adminRouter.post('/add-hospital',authAdmin,upload.single('image'),addHospital);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/all-doctors',authAdmin, allDoctors);
adminRouter.post('/all-hopitals',authAdmin, allHospitals);
adminRouter.post('/all-doctors-by-hospital',authAdmin, getDoctorByHospital);
adminRouter.post('/change-avalibility',authAdmin, changeAvilability);
adminRouter.get('/hospital/:id',authAdmin, changeAvilability);


export default adminRouter;