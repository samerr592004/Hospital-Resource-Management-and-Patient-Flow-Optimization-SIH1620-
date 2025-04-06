import doctorModel from '../models/doctorModel.js'
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
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
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
      const appointments = await appointmentModel.find({ docId ,isCompleted: false}); // Add await
      res.json({ success: true, appointments });
    } catch(error) {
      res.json({ success: false, message: error.message });
    }
  }


export { changeAvilability, doctorList, loginDoctor,appoinmentDoctor}