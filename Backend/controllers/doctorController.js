import doctorModel from '../models/doctorModel.js'
import hospitalModel from '../models/hospitalModel.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'


const changeAvilability = async (req, res) => {
    try {
        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { avilable: !docData.avilable })
        res.json({
            success: true,
            message: "Avilability Changed"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })

    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }

}


//API fo doctor Login
const loginDoctor = async (req, res) => {


    try {

        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: "Invalid credentials." })
        }

        const isMatch = await bcryptjs.compare(password, doctor.password)
        console.log(isMatch)


        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            return res.json({ success: false, message: "Invalid credentials." })
        }




    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })

    }


}




//API for get alll appoinment of doctor.


const appoinmentDoctor = async (req, res) => {
    try {
        const { docId } = req.body;
        const appointments = await appointmentModel.find({ docId, isCompleted: false, cancelled: false }); // Add await
        res.json({ success: true, appointments });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


//API for cancel the Appointment


const cancelAppointmentDoctor = async (req, res) => {
    try {
        const { appointmentId, docId } = req.body;

        // 1. Find the appointment
        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({
                success: false,
                message: "Appointment not found."
            });
        }

        // 2. Verify doctor authorization
        if (docId !== appointment.docId.toString()) {
            return res.json({
                success: false,
                message: "Unauthorized access."
            });
        }

        // 3. Mark appointment as cancelled
        await appointmentModel.findByIdAndUpdate(
            appointmentId,
            { cancelled: true }
        );

        const { slotDate, slotTime } = appointment;

        // 4. Get the doctor
        const doctor = await doctorModel.findById(appointment.docId);
        if (!doctor) {
            return res.json({
                success: false,
                message: "Doctor not found"
            });
        }



        if (doctor.slot_booked && doctor.slot_booked[slotDate]) {

            let slot_booked = doctor.slot_booked

            slot_booked[slotDate] = slot_booked[slotDate].filter(e => e !== slotTime)

            await doctorModel.findByIdAndUpdate(appointment.docId, { slot_booked })


        }
        // If no more slots for that date, remove the date entry
        if (doctor.slot_booked[slotDate].length === 0) {
            delete doctor.slot_booked[slotDate];
        }

        await doctor.save();

        res.json({
            success: true,
            message: "Appointment cancelled successfully."
        });

    } catch (error) {
        console.error("Error cancelling appointment:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


//API for geting Doctor Data.
const getDoctorData = async (req, res) => {
    try {
        const { docId } = req.body

        const doctorData = await doctorModel.findById(docId).select("-password")

        if (!doctorData) {
            return res.json({ success: false, message: "Unauthorised access." })
        }
        const { hospital } = doctorData

        const hospitalData = await hospitalModel.findById(hospital)


        if (!hospitalData) {
            return res.json({ success: false, message: "Unauthorised access." })
        }
        const { name, address, city, district, state, zipcode } = hospitalData

        const hospitalInfo = {
            name: name, address: address, city: city, district: district, state: state, zipcode: zipcode
        }

        res.json({
            success: true,
            doctorData,
            hospitalInfo

        })
       

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }

}

//API for doctor dahsboard data.
const getDoctorDashboardData = async (req, res) => {
    try {
        const { docId } = req.body;

        if (!docId) {
            return res.json({
                success: false,
                message: "Doctor ID is required"
            });
        }

        // Get all appointments sorted by date and time
        const allAppointments = await appointmentModel.find({ docId })
            .sort({ slotDate: 1, slotTime: 1 })
            .lean();

        // Get today's date in DD/MM/YYYY format
        const today = new Date();
        const todayFormatted = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

        // Prepare arrays for categorized appointments
        const todayAppointments = [];
        const upcomingAppointments = [];
        const cancelledAppointments = [];
        const completedAppointments = [];

        // Helper function to convert time string to minutes for proper sorting
        const timeToMinutes = (timeStr) => {
            const [time, period] = timeStr.split(' ');
            const [hours, minutes] = time.split(':').map(Number);
            let totalMinutes = hours * 60 + minutes;
            if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
            if (period === 'AM' && hours === 12) totalMinutes -= 12 * 60;
            return totalMinutes;
        };

        // Categorize appointments
        for (let appointment of allAppointments ) {
            if (appointment.cancelled && appointment.slotDate === todayFormatted) {
                cancelledAppointments.push(appointment);
                
            } else if (appointment.isCompleted) {
                if (appointment.slotDate === todayFormatted) {
                    completedAppointments.push(appointment);
                }
            } else if (appointment.slotDate === todayFormatted) {
                todayAppointments.push(appointment);
                upcomingAppointments.push(appointment);
            } else {
                // Compare dates to find upcoming appointments
                const [day, month, year] = appointment.slotDate.split('/').map(Number);
                const appointmentDate = new Date(year, month - 1, day);
                
                if (appointmentDate >= new Date(today.setHours(0, 0, 0, 0)) && !appointment.cancelled ) {
                    upcomingAppointments.push(appointment);
                }
            }
        }

        // Sort function for appointments by date and time
        const sortAppointments = (a, b) => {
            // First compare dates
            const [aDay, aMonth, aYear] = a.slotDate.split('/').map(Number);
            const [bDay, bMonth, bYear] = b.slotDate.split('/').map(Number);
            
            const aDate = new Date(aYear, aMonth - 1, aDay);
            const bDate = new Date(bYear, bMonth - 1, bDay);
            
            if (aDate < bDate) return -1;
            if (aDate > bDate) return 1;
            
            // If dates are equal, compare times
            const aMinutes = timeToMinutes(a.slotTime);
            const bMinutes = timeToMinutes(b.slotTime);
            
            return aMinutes - bMinutes;
        };

        // Sort all categories
        todayAppointments.sort(sortAppointments);
        upcomingAppointments.sort(sortAppointments);
        cancelledAppointments.sort(sortAppointments);
        completedAppointments.sort(sortAppointments);

        const dashboardData = {
            today: todayAppointments,
            canceled: cancelledAppointments,
            completed: completedAppointments,
            upcoming: upcomingAppointments,
            counts: {
                today: todayAppointments.length,
                upcoming: upcomingAppointments.length,
                canceled: cancelledAppointments.length,
                completed: completedAppointments.length
            }
        };

        res.status(200).json({
            success: true,
            message: "Dashboard data retrieved successfully",
            dashboardData
        });

    } catch (error) {
        console.error('Error in getDoctorDashboardData:', error);
        res.json({
            success: false,
            message: "Internal server error"
        });
    }
}

const completeAppointmentDoctor = async (req,res)=>{
    try{
        const {docId,appointmentId} = req.body

           // 1. Find and update the appointment
           const appointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            { isCompleted: true ,},
            { new: true }
        );

        if (!appointment) {
            return res.json({
                success: false,
                message: "Appointment not found"
            });
        }

        if (appointment.docId.toString() !== docId) {

            return res.json({
              success: false,
              message: "Unauthorised access."
            });
          }
          

        // 2. Get the doctor and remove the time slot
        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
            return res.json({
                success: false,
                message: "Doctor not found"
            });
        }

        const slotDate = appointment.slotDate;
        const slotTime = appointment.slotTime;

        if (doctor.slot_booked && doctor.slot_booked[slotDate]) {
            // Create a new object to avoid modifying the original directly
            const updatedSlotBooked = { ...doctor.slot_booked };

            // Filter out the completed time slot
            updatedSlotBooked[slotDate] = updatedSlotBooked[slotDate].filter(
                time => time !== slotTime
            );

            // If no more slots for that date, remove the date entry
            if (updatedSlotBooked[slotDate].length === 0) {
                delete updatedSlotBooked[slotDate];
            }

            // Update the doctor's slot_booked
            doctor.slot_booked = updatedSlotBooked;
            await doctor.save();
        }

        res.json({
            success: true,
            message: "Consultation completed successfully.",

        });

        

    }catch(error){
        console.error('Error in getDoctorDashboardData:', error);
        res.json({
            success: false,
            message: "Internal server error"
        });

    }
}

//API for update doctor profile 
const updateDoctorProfile = async (req,res)=>{ 
    try{
        const {docId,fees,address,avilable} = req.body

        await doctorModel.findByIdAndUpdate(docId,{fees,address,avilable})
        res.json({success:true,message:"Profile Updated."})
    }catch(error){
        
        res.json({
            success: false,
            message: "Internal server error"
        });

    }

}

export { changeAvilability, doctorList, loginDoctor,
     appoinmentDoctor, cancelAppointmentDoctor, getDoctorData, 
     getDoctorDashboardData ,completeAppointmentDoctor,updateDoctorProfile}