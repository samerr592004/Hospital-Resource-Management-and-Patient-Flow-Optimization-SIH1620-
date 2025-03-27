 import doctorModel from '../models/doctorModel.js'



 const changeAvilability =async(req,res)=>{
    try{
        const {docId}=req.body

        const docData =await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{avilable:!docData.avilable})
        res.json({
            success:true,
            message:"Avilability Changed"
        })
    }catch(error){
        res.json({
            success:false,
            message:error.message
        })

    }
 }

 const doctorList= async (req,res) =>{
    try{
        const doctors=await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})
    }catch(error){
        res.json({
            success:false,
            message:error.message
        })
    }

 } 
 const doctorListByHospitsl= async (req,res) =>{
    try{
        const doctors=await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})
    }catch(error){
        res.json({
            success:false,
            message:error.message
        })
    }

 } 

 export {changeAvilability,doctorList}