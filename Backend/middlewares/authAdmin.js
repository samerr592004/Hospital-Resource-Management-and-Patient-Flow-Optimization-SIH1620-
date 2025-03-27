import jwt from 'jsonwebtoken'


// admin authAdmin middleware

const authAdmin=async(req,res,next)=>{
    try{

        const {atoken}=req.headers
        // console.log(atoken)
        
        if(!atoken){
            return res.json({ success: false,token:atoken, message: "Not  Authorized Login Again"});
        }
        const token_decode=jwt.verify(atoken,process.env.JWT_SECRET)
        
        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){

            return res.json({ success: false,token:token_decode, message: "Not Authorized Login Again"});

        }
        next()
    }catch(error){
        console.log(error)
        return res.json({ success: false, message:error  });
    }
}


export default authAdmin