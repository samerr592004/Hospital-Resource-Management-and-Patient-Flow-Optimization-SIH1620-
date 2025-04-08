  
  import nodemailer from 'nodemailer'
  
  const sendMail = async (data)=>{

  
  const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure:true,
            auth: {
                user: process.env.GMAIL,
                pass:process.env.PASSCODE
            }
        })

       

        const mailOptions = {
            from: "sameerkumar592004@gmail.com",
            to: data.userData.email,
            subject: `📅 Appointment Confirmation – ${data.docData.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                    
                    <!-- Hospital Header -->
                    <div style="text-align: center; padding-bottom: 20px;">
                        <img src=${data.docData.image} style="max-width: 150px;">
                        <h2 style="color: #0077b6; margin-top: 10px;">Appointment Confirmation</h2>
                    </div>
        
                    <!-- Patient Details -->
                    <p style="color: #333; font-size: 16px;">Dear <strong>${data.userData.name}</strong>,</p>
                  
                    
                    <!-- Appointment Details -->
                    <div style="background: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <ul style="list-style: none; padding: 0; font-size: 16px; color: #444;">
                            <li style="padding: 8px 0;"><strong>👨‍⚕️ Doctor:</strong> Dr. ${data.docData.name}</li>
                            <li style="padding: 8px 0;"><strong>📅 Appointment Date:</strong> ${data.slotDate}</li>
                            <li style="padding: 8px 0;"><strong>⏰ Time:</strong> ${data.slotTime}</li>
                        
                        </ul>
                    </div>
        
                    <!-- Instructions Section -->
                    <div style="margin-top: 20px; padding: 15px; border-left: 5px solid #0077b6; background: #eef7fc; border-radius: 6px;">
                        <p style="color: #333;"><strong>Instructions for Your Visit</strong></p>
                        <ul style="color: #555; font-size: 14px; padding-left: 20px;">
                            <li>Please arrive at least 15 minutes before your scheduled appointment.</li>
                            <li>Carry your hospital ID (if applicable) and any relevant medical reports.</li>
                            <li>Wear a mask and follow all hospital safety protocols.</li>
                        </ul>
                    </div>
        
                    <!-- Support Section -->
                    <div style="margin-top: 20px; padding: 15px; border-left: 5px solid #0077b6; background: #eef7fc; border-radius: 6px;">
                        <p style="color: #333;"><strong>Need Help?</strong></p>
                        <p style="color: #555;">If you have any questions or need to reschedule, please contact the hospital administration.</p>
                    </div>
        
                    <!-- Footer -->
                    <div style="text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd;">
                        <p style="color: #555; font-size: 14px;"><strong>Hospital Management Team</strong></p>
                        <p style="color: #0077b6; font-size: 14px;"><strong>📞 Contact:</strong> ${data.docData.phone}</p>
                        <p style="color: #0077b6; font-size: 14px;"><strong>📧 Email:</strong> ${data.docData.email}</p>
                        <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply.</p>
                    </div>
                </div>
            `
        };
        
        
        await transporter.sendMail(mailOptions,(error,emailResponse)=>{
            if(error){
                throw error
                console.log(error)
                return false
            }
            res.end()
        });
        // console.log("Email sent successfully to:", user.email)
       
        
       

        return true
    }

    export default sendMail