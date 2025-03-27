import validator from 'validator';
import bcryptjs from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import hospitalModel from '../models/hospitalModel.js';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';
// Add Doctor
const addDoctor = async (req, res) => {
  
  try {


    const { name, email, password, speciality, degree, experience, about, fees, address , hospital} = req.body;
    const imageFile = req.file;



    // Validate required fields
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address ||  !hospital) {
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


    let imageUrl = null;
    if (imageFile) {
      try {


        const resizedImagePath = `uploads/resized-${Date.now()}.jpg`;
        await sharp(imageFile.path)
          .resize(411, 411) // Resize to 300x300 pixels
          .toFormat('jpeg') // Convert to JPEG format
          .jpeg({ quality: 80 }) // Adjust quality
          .toFile(resizedImagePath);  // Save resized image locally

        // Upload resized image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(resizedImagePath, { resource_type: 'image' });
        imageUrl = imageUpload.secure_url;
      } catch (error) {


        return res.json({ success: false, message: 'Image upload failed', error: error.message });
      }
    }

    // Create doctor data
    const doctorData = {
      name,
      email,
      image: imageUrl || '', // Set default empty string if no image is uploaded
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: typeof address === 'string' ? JSON.parse(address) : address, // Ensure correct format
      hospital,
      date: Date.now(),
    };

    // Save doctor to database
    const newDoctor = new doctorModel(doctorData);

    await newDoctor.save();

    res.json({ success: true, message: 'Doctor Added', data: doctorData });
  } catch (error) {

    if(error.code === 11000){
      res.json({ success: false, message:`${ error.keyValue.email} Is Alredy Exists` })
    }
    console.error('Error adding doctor:', error);
    res.json({ success: false, message: error.errmsg });
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
      const token = jwt.sign(email+password,process.env.JWT_SECRET); // Expires in 24 hours
      res.json({ success: true, token,message:'Login Successful!' });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.json({ success: false, message: error.message });
  }
};


// API to get all data from  daoctor list
const allDoctors= async (req,res)=>{
  try{
    const doctors=await doctorModel.find({}).select('-password')
    res.json({success:true,doctors})

  }catch(error){
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

//API to get all doctor of a hospital

const getDoctorByHospital = async (req, res) => {
  try {
    const { hospitalid } = req.headers; // Get hospitalId from headers


    if (!hospitalid) {
      return res.json({ success: false, message: "Hospital ID is required" });
    }

    const doctors = await doctorModel.find({hospital: hospitalid }).select("-password"); // Filter doctors by hospitalId

    

    res.json({ success: true, doctors });

    // console.log(doctors)
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};





// API to get all data from  daoctor list
const allHospitals= async (req,res)=>{
  try{
    const hospitals=await hospitalModel.find({}).select('-date')
    res.json({success:true,hospitals})

  }catch(error){
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

export { addDoctor, loginAdmin,allDoctors,addHospital,allHospitals ,getDoctorByHospital};
  