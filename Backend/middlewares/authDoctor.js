import jwt from 'jsonwebtoken'




// Doctor authAdmin middleware

const authDoctor=async(req,res,next)=>{
    try{
        

        const {dtoken}=req.headers
      
        
        if(!dtoken){
            return res.json({ success: false,dtoken:dtoken, message: "Not  Authorized Login Again"});
        }
        const dtoken_decode=jwt.verify(dtoken,process.env.JWT_SECRET)
        req.body.docId = dtoken_decode.id
        
        next()
    }catch(error){
        console.log(error)
        return res.json({ success: false, message:error  });
    }
}





export default authDoctor