import hospitalModel from '../models/hospitalModel.js'

const hospitalList= async (req,res) =>{
    try{
        const hospital=await hospitalModel.find({}).select(['-date'])
        res.json({success:true,hospital})
    }catch(error){
        res.json({
            success:false,
            message:error.message
        })
    }

 } 



 export {hospitalList}
