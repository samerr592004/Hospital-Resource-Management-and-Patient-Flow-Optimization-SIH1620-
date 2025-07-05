import validator from 'validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js';
import hospitalModel from '../models/hospitalModel.js';
import nodemailer from 'nodemailer'
import sendMail from '../config/sendMail.js';
import razorpay from 'razorpay'
import sendOtpMail from '../config/sendOtpMail.js';
// Register User API
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;



        const userFound = await userModel.find({email}).select('-password')

        if(userFound){
            return res.json({ success: false, message: "User already existed." });
        }


        


        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing details." });
        }



        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email." });
        }


        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long." });
        }


        // Strong Password Validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.json({
                success: false,
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists." });
        }

        // Hash Password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Save User to Database
        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        // Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ success: true, token });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Login User API
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User does not exist.' });
        }

        // Compare Password
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        // Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ success: true, token });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get User Profile API
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body; // Extract userId from request (set by auth middleware)

        // Find user by ID, excluding password field
        const userData = await userModel.findById(userId).select('-password');

        // Check if user exists
        if (!userData) {
            return res.json({ success: false, message: "User not found." });
        }

        res.json({ success: true, userData });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to update user profile

const updateProfile = async (req, res) => {
    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file
        if (!userId) {
            return res.json({ success: false, message: "User ID is required." });
        }

        if (!name || !phone || !address || !dob || !gender) {
            return res.json({ success: true, message: "Data Missing" })

        }
        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {

            //uppload the image
            const imageUplaod = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageUrl = imageUplaod.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageUrl })




        }
        res.json({ success: true, message: "Profile Successfully Updated" });

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error });
    }
}

// API for book appointment

const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body

        const docData = await doctorModel.findById(docId).select("-password")

        const hospital = await hospitalModel.findById(docData.hospital).select('name address city district zipcode -_id');

        if (!hospital) {
            return res.json({ success: false, message: "Hospital not available." })
        }

        const hospitalName = hospital.name;
        const hospitalAddress1 = hospital.address + "," + hospital.city + ","
        const hospitalAddress2 = hospital.district + "," + hospital.zipcode


        if (!docData.avilable) {
            console.log(docData.avilable)
            return res.json({ success: false, message: "Doctor not available." })
        }

        let slots_booked = docData.slot_booked

        // checking for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot is already booked. Please select a different time." })

            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slot_booked

        const appointmentData = {
            hospitalName,
            hospitalAddress1,
            hospitalAddress2,
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }


        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()


        // save new date in docData
        await doctorModel.findByIdAndUpdate(docId, { slot_booked: slots_booked });

        let sent = sendMail(appointmentData)
        // console.log(docData.slot_booked)
        if (sent)
            res.json({ success: true, message: "Appointment Booked." })
        else
            res.json({ success: false, message: "Error Booking in Appointment" })




    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message });

    }

}


//Api for list of Appointment
const listAppointment = async (req, res) => {

    try {
        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId, isReviewed: false })

        res.json({ success: true, appointments })



    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message });


    }

}

//Api for book a bed
const bookBed = async (req, res) => {
    try {
        const { userId, key, hospitalId, bedId, date, patientName, patientCondition } = req.body;

        // Find the user by userId
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Find the hospital by hospitalId
        const hospital = await hospitalModel.findById(hospitalId);
        if (!hospital) {
            return res.json({ success: false, message: "Hospital not found" });
        }

        // Ensure user.beds exists as an object
        if (!user.beds) {
            user.beds = {};
        }
        if (user.beds[key]) {
            return res.json({
                success: false, message: "This bed is occupied please choose another Bed"
            })
        }

        // Add booking to user.beds
        user.beds[key] = {
            hospitalId,
            hospitalName: hospital.name,
            hospitalImage: hospital.image,
            bedId,
            date,
            patientName,
            patientCondition,
            date: date,
        };
        user.markModified("beds");

        // Ensure hospital.bedOccupiedData exists as an object
        if (!hospital.bed_occupied) {
            hospital.bed_occupied = {};
        }
        if (user.beds[bedId]) {
            return res.json({
                success: false, message: "This bed is occupied please choose another Bed"
            })
        }


        // Store the occupied bed in the hospital with a dynamic key
        hospital.bed_occupied[bedId] = {
            userId,
            patientName,
            patientCondition,
            date: date,
        };

        hospital.markModified("bed_occupied");

        // Save both updates
        await user.save();
        await hospital.save();


        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL,
                pass: process.env.PASSCODE
            }
        })



        const mailOptions = {
            from: "sameerkumar592004@gmail.com",
            to: user.email,
            subject: `🏥 Bed Booking Confirmation – ${hospital.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                    
                    <!-- Hospital Header -->
                    <div style="text-align: center; padding-bottom: 20px;">
                        <img src=${hospital.image} alt="Hospital Logo" style="max-width: 150px;">
                        <h2 style="color: #0077b6; margin-top: 10px;">Bed Booking Confirmation</h2>
                    </div>
        
                    <!-- Patient Details -->
                    <p style="color: #333; font-size: 16px;">Dear <strong>${patientName}</strong>,</p>
                    <p style="color: #555;">Your bed has been successfully booked at <strong>${hospital.name}</strong>. Below are the details of your booking:</p>
                    
                    <!-- Booking Details -->
                    <div style="background: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <ul style="list-style: none; padding: 0; font-size: 16px; color: #444;">
                            <li style="padding: 8px 0;"><strong>🏥 Hospital Name:</strong> ${hospital.name}</li>
                            <li style="padding: 8px 0;"><strong>🛏️ Bed Number:</strong> #${bedId}</li>
                            <li style="padding: 8px 0;"><strong>📅 Booking Date:</strong> ${date}</li>
                            <li style="padding: 8px 0;"><strong>🩺 Patient Condition:</strong> ${patientCondition}</li>
                        </ul>
                    </div>
        
                    <!-- Support Section -->
                    <div style="margin-top: 20px; padding: 15px; border-left: 5px solid #0077b6; background: #eef7fc; border-radius: 6px;">
                        <p style="color: #333;"><strong>Need Help?</strong></p>
                        <p style="color: #555;">If you have any questions or need assistance, please contact the hospital administration.</p>
                    </div>
        
                    <!-- Footer -->
                    <div style="text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd;">
                        <p style="color: #555; font-size: 14px;"><strong>Hospital Management Team</strong></p>
                        <p style="color: #0077b6; font-size: 14px;"><strong>📞 Contact:</strong> ${hospital.contact.phone}</p>
                        <p style="color: #0077b6; font-size: 14px;"><strong>📧 Email:</strong> ${hospital.contact.email}</p>
                        <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply.</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions, (error, emailResponse) => {
            if (error) {
                throw error
                console.log(error)
            }
            console.log("success")
            res.end()
        });
        console.log("Email sent successfully to:", user.email)




        return res.json({ success: true, message: "Bed booked successfully and confirmation email sent." });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: error.message });
    }
};


//API for rateing]
const giveRating = async (req, res) => {
    try {
        const { skip } = req.body

        if (skip) {
            const { userId, docId, appointmentId, slotDate, slotTime } = req.body;

            if (!userId || !docId || !appointmentId || !slotDate || !slotTime) {
                return json({ success: false, message: "Missing required fields" });
            }

            const doctorData = await doctorModel.findById(docId)

            let slot_booked = doctorData.slot_booked || {}

            if (slot_booked[slotDate] && Array.isArray(slot_booked[slotDate])) {
                slot_booked[slotDate] = slot_booked[slotDate].filter(e => e !== slotTime);

                // Remove the date entry if no slots left
                if (slot_booked[slotDate].length === 0) {
                    delete slot_booked[slotDate];
                }
            }

            const t = await doctorModel.findByIdAndUpdate(docId, { slot_booked })

            const b = await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true, payment: true, isReviewed: true })






        } else {
            const { userId, docId, appointmentId, stars, feedback, slotDate, slotTime } = req.body;


            if (!userId || !docId || !appointmentId || stars === undefined) {
                return json({ success: false, message: "Missing required fields" });
            }

            const appointment = await appointmentModel.findOne({ _id: appointmentId, userId });

            if (!appointment) {
                return res.json({ success: false, message: "Appointment not found or unauthorized" });
            }

            const doctor = await doctorModel.findById(docId);

            if (!doctor) {
                return res.json({ success: false, message: "Doctor not found" });
            }

            if (!doctor.rating) {
                doctor.rating = {};
            }
            const user = await userModel.findById(userId);
            const image = user.image

            // Convert rating to float before storing
            const ratingFloat = parseFloat(stars).toFixed(1);
            const today = new Date();
            const todayFormatted = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`

            // Update user's rating
            await doctorModel.findByIdAndUpdate(
                doctor._id,
                { [`reviews.${userId}`]: { stars: ratingFloat, feedback, image, name: user.name, date: todayFormatted } },
                { new: true, upsert: true }
            );


            const ratings = Object.values(doctor.reviews).map(entry => Number(entry.stars))

            const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
            const averageRating = totalRating / ratings.length;

            // Update doctor's total rating
            await doctorModel.findByIdAndUpdate(
                docId,
                { total_rate: parseFloat(averageRating.toFixed(1)) }
            );

            // Get current doctor data
            const doctorData = await doctorModel.findById(docId);

            // Initialize slot_booked if it doesn't exist
            let slot_booked = doctorData.slot_booked || {};

            // Ensure the date exists and has an array before filtering
            if (slot_booked[slotDate] && Array.isArray(slot_booked[slotDate])) {
                slot_booked[slotDate] = slot_booked[slotDate].filter(e => e !== slotTime);

                // Remove the date entry if no slots left
                if (slot_booked[slotDate].length === 0) {
                    delete slot_booked[slotDate];
                }
            }

            // Update doctor's slot_booked
            await doctorModel.findByIdAndUpdate(
                docId,
                { slot_booked },
                { new: true }
            );

            // Update appointment status
            await appointmentModel.findByIdAndUpdate(
                appointmentId,
                {
                    isCompleted: true,
                    payment: true,
                    isReviewed: true
                },
                { new: true }
            );

            await doctor.save();

            res.json({ success: true, message: "Your rating and feedback have been submitted." });
        }

    } catch (error) {
        console.error(error);
        res.json({ message: "Internal server error" });
    }
};

// API for cancel the appointment
const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized action." })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });


        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slot_booked = doctorData.slot_booked

        slot_booked[slotDate] = slot_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slot_booked })

        // console.log(slots_booked)

        res.json({ success: true, message: "Appointment canceled." })


    } catch (error) {
        console.error(error);
        res.json({ message: "Internal server error" });

    }

}


//API for cancel be reservation
const cancelBeds = async (req, res) => {
    try {
        const { bedKey, userId } = req.body;

        // Validate input
        if (!bedKey || !userId) {
            return res.status(400).json({
                success: false,
                message: "Missing bedKey or userId in request"
            });
        }

        // Find user and validate
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({
                success: false,
                message: "User not found !"
            });
        }

        // Get bed details from user's beds
        const beds = { ...userData.beds }; // Create copy
        if (!beds[bedKey]) {
            return res.json({
                success: false,
                message: "Bed reservation not found !"
            });
        }

        const { hospitalId, bedId } = beds[bedKey];

        // Find hospital and validate
        const hospitalData = await hospitalModel.findById(hospitalId);
        if (!hospitalData) {
            return res.json({
                success: false,
                message: "Hospital not found !"
            });
        }

        // Create immutable copies before modification
        const updatedBedOccupied = { ...hospitalData.bed_occupied };
        const updatedUserBeds = { ...beds };

        // Remove the bed references
        delete updatedBedOccupied[bedId];
        delete updatedUserBeds[bedKey];

        // Update both collections in parallel
        await Promise.all([
            hospitalModel.findByIdAndUpdate(
                hospitalId,
                { bed_occupied: updatedBedOccupied },
                { new: true }
            ),
            userModel.findByIdAndUpdate(
                userId,
                { beds: updatedUserBeds },
                { new: true }
            )
        ]);

        return res.json({
            success: true,
            message: "Bed reservation cancelled successfully.",
            data: {
                bedId,
                hospitalId
            }
        });

    } catch (error) {
        console.error("Error in cancelBeds:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


const timeOut = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        // 1. Find and update the appointment
        const appointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            { isCompleted: true },
            { new: true }
        );

        if (!appointment) {
            return res.json({
                success: false,
                message: "Appointment not found"
            });
        }

        // 2. Get the doctor and remove the time slot
        const doctor = await doctorModel.findById(appointment.docId);
        if (!doctor) {
            return res.json({
                success: false,
                message: "Doctor not found"
            });
        }

        // 3. Remove the time slot from slot_booked
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
            message: "Appointment marked as completed and time slot freed",

        });

    } catch (error) {
        toast.error("Error in timeout appointment:", error);
        res.json({
            success: false,
            message: "Internal server error",

        });
    }
};


// const razorpayInstance = new razorpay({
//     key_id:'',
//     key_secret:''
// })

//API for payment of appointment online
// const paymentRazorpay = async (req, res) => {


// }


const forgetpasswordUser = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User with this email does not exist.",
            });
        }

        // ✅ Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

       
        // ✅ Send OTP via email
        await sendOtpMail(email, otp,user.name);

        return res.json({
            success: true,
            message: "OTP sent to your email.",
            otp
        });
    } catch (error) {
        console.error("Forget Password Error:", error);
        return res.json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


const resetPassword = async (req, res) => {
    try {
      const { email, newPassword } = req.body;

      
  
      const user = await userModel.findOne({ email });
      if (!user) {
       
        return res.json({ success: false, message: "User not found." });
      }
  
      if (newPassword.length < 8) {
        return res.json({
          success: false,
          message: "Password must be at least 8 characters long.",
        });
      }
  
      // ✅ Strong Password Validation
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
      if (!passwordRegex.test(newPassword)) {
        return res.json({
          success: false,
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        });
      }
  
      // ✅ Hash new password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(newPassword, salt);
  
      // ✅ Update and save
      user.password = hashedPassword;


      await user.save();

    //   console.log(newPassword)
  
      return res.json({
        success: true,
        message: "Password reset successfully.",
      });
    } catch (error) {
      console.error("Reset Password Error:", error);
      return res.json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, bookBed, giveRating, cancelAppointment, cancelBeds, timeOut, forgetpasswordUser ,resetPassword};
