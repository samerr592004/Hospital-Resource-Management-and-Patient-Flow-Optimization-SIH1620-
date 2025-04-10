import express from 'express'
import { doctorList,loginDoctor ,appoinmentDoctor,cancelAppointmentDoctor,getDoctorData,getDoctorDashboardData,completeAppointmentDoctor, updateDoctorProfile} from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'






const doctorRouter=express.Router()
doctorRouter.get('/list',doctorList)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appointments',authDoctor,appoinmentDoctor)
doctorRouter.get('/get-doctor-data',authDoctor,getDoctorData)
doctorRouter.get('/get-dashboard-data',authDoctor,getDoctorDashboardData)
doctorRouter.post('/cancel-appointment',authDoctor,cancelAppointmentDoctor)
doctorRouter.post('/complete-appointment',authDoctor,completeAppointmentDoctor)
doctorRouter.post('/update-profile',authDoctor,updateDoctorProfile)






export default doctorRouter