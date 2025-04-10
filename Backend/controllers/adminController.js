import validator from 'validator';
import bcryptjs from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import hospitalModel from '../models/hospitalModel.js';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';


// Add Doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address, hospital } = req.body;
    const imageFile = req.file;

    // Validate required fields
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !hospital) {
      return res.json({ success: false, message: 'Missing Details' });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Please enter a valid email' });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.json({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

   const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'})
   const imageUrl = imageUpload.secure_url
    // Create doctor data
    const doctorData = {
      name,
      email,
      image: imageUrl, // This will be either the URL or empty string
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: typeof address === 'string' ? JSON.parse(address) : address,
      hospital,
      date: Date.now(),
    };

    // Save doctor to database
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: 'Doctor Added', data: doctorData });
  } catch (error) {
    if (error.code === 11000) {
      res.json({ success: false, message: `${error.keyValue.email} Is Already Exists` });
    } else {
      console.error('Error adding doctor:', error);
      res.json({ success: false, message: error.message || 'Failed to add doctor' });
    }
  }
};
//Add Hospital

const addHospital = async (req, res) => {
  try {
    const {
      name, address, state, district, city,
      latitude, longitude, zipcode,
      constructed, about, bedNumber, contact
    } = req.body;

    const imageFile = req.file;

    // Validate required fields
    if (!name || !latitude || !longitude || !address || !zipcode || !constructed || !about || !bedNumber || !contact || !imageFile || !state || !district || !city) {
      return res.json({ success: false, message: 'Missing Details' });
    }

    // Validate latitude and longitude range
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.json({ success: false, message: 'Invalid latitude or longitude values' });
    }

    // Process image upload without rotation or resizing
    let imageUrl = null;
    try {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: 'image',
        overwrite: true,
        use_filename: true,
      });
      imageUrl = imageUpload.secure_url;
    } catch (error) {
      return res.json({ success: false, message: 'Image upload failed', error: error.message });
    }

    // Create hospital data
    const hospitalData = {
      name,
      address,
      state,
      district,
      city,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      zipcode,
      constructed: Number(constructed),
      about,
      bedNumber: Number(bedNumber),
      contact: typeof contact === 'string' ? JSON.parse(contact) : contact,
      image: imageUrl,
      date: Date.now(),
    };

    // Save hospital to database
    const newHospital = new hospitalModel(hospitalData);
    await newHospital.save();

    res.json({ success: true, message: 'Hospital Added Successfully', data: hospitalData });
  } catch (error) {
    if (error.code === 11000) {
      res.json({ success: false, message: `${error.keyValue.name} already exists` });
    }
    console.error('Error adding hospital:', error);
    res.json({ success: false, message: error.message });
  }
};


// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET); // Expires in 24 hours
      res.json({ success: true, token, message: 'Login Successful!' });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.json({ success: false, message: error.message });
  }
};


// API to get all data from  daoctor list
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({ success: true, doctors })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

//API to get all doctor of a hospital

const getDoctorByHospital = async (req, res) => {
  try {
    const { hospitalid } = req.headers; // Get hospitalId from headers


    if (!hospitalid) {
      return res.json({ success: false, message: "Hospital ID is required" });
    }

    const doctors = await doctorModel.find({ hospital: hospitalid }).select("-password"); // Filter doctors by hospitalId



    res.json({ success: true, doctors });

    // console.log(doctors)
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};





// API to get all data from  daoctor list
const allHospitals = async (req, res) => {
  try {
    const hospitals = await hospitalModel.find({}).select('-date')
    res.json({ success: true, hospitals })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


//API to get all appointmentlist
const appointmentAdmin = async (req, res) => {
  try {

    const appointments = await appointmentModel.find({isComplete:false})

    res.json({ success: true, appointments })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })

  }
}


const cancelAppointmentAdmin = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);
    if (!doctorData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    let slot_booked = doctorData.slot_booked || {};
    
    // Initialize the array for the date if it doesn't exist
    if (!slot_booked[slotDate]) {
      slot_booked[slotDate] = [];
    }

    // Filter out the time slot
    slot_booked[slotDate] = slot_booked[slotDate].filter(e => e !== slotTime);

    await doctorModel.findByIdAndUpdate(docId, { slot_booked });

    res.json({ success: true, message: "Appointment canceled." });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

//API for getting dashboard Data
const adminDashboard = async (req, res) => {
  try {

    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const hospitals = await hospitalModel.find({})
    const appointments = await appointmentModel.find({})

    const today = new Date();
    const todayFormatted = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    const todayAppointmentsCount = await appointmentModel.countDocuments({
      slotDate: todayFormatted,
      cancelled: false
    })
    const specialtyDistribution = await doctorModel.aggregate([
      {
        $group: {
          _id: '$speciality',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueData = await appointmentModel.aggregate([
      {
        $match: {
          cancelled: false,
          payment: true,
          date: { $gte: thirtyDaysAgo.getTime() }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$date" } } },
          dailyRevenue: { $sum: "$amount" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    const ageDistribution = await userModel.aggregate([
      {
        $match: {
          dob: { $ne: "Not Selected", $exists: true }
        }
      },
      {
        $addFields: {
          birthYear: { $toInt: { $arrayElemAt: [{ $split: ["$dob", "/"] }, 2] } } // Assuming dob format: DD/MM/YYYY
        }
      },
      {
        $addFields: {
          age: {
            $subtract: [
              new Date().getFullYear(),
              "$birthYear"
            ]
          }
        }
      },
      {
        $bucket: {
          groupBy: "$age",
          boundaries: [0, 18, 30, 45, 60, 75, 100],
          default: "Other",
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);




    const dashboardData = {
      doctors: doctors.length,
      patients: users.length,
      hospitals: hospitals.length,
      appointments: appointments.length,
      todayAppointmentsCount,
      latetestAppointments: appointments.reverse().slice(0, 10),
      specialtyDistribution: {
        labels: specialtyDistribution.map(s => s._id),
        data: specialtyDistribution.map(s => s.count)
      },
      ageDistribution: {
        labels: ageDistribution.map(a => {
          if (a._id === 0) return "0-18";
          if (a._id === 18) return "18-30";
          if (a._id === 30) return "30-45";
          if (a._id === 45) return "45-60";
          if (a._id === 60) return "60-75";
          return "75+";
        }),
        data: ageDistribution.map(a => a.count)
      },
      revenueTrend: {
        labels: revenueData.map(r => r._id),
        data: revenueData.map(r => r.dailyRevenue)
      }


    }


    // console.log(dashboardData)

    res.json({ success: true, dashboardData })

  } catch (error) {
    console.error(error);
    res.json({ message: "Internal server error" });
  }
}

export { addDoctor, loginAdmin, allDoctors, addHospital, allHospitals, getDoctorByHospital, appointmentAdmin, cancelAppointmentAdmin, adminDashboard };
