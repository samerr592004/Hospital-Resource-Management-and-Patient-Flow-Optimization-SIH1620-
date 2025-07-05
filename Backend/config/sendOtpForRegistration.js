import nodemailer from 'nodemailer';

const sendOtpForRegistration= async (email, otp, name = 'User') => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSCODE
      }
    });

    const mailOptions = {
      from: process.env.GMAIL,
      to: email,
      subject: `🔐 Your OTP for Password Reset`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
          <!-- Header -->
          <div style="text-align: center; padding-bottom: 20px;">
            <h2 style="color: #0077b6; margin-top: 10px;">Password Reset OTP</h2>
          </div>
    
          <!-- Greeting -->
          <p style="color: #333; font-size: 16px;">Dear <strong>${name}</strong>,</p>
          <p style="color: #555;">You requested a password reset for your account. Here is your one-time password (OTP):</p>
          
          <!-- OTP Display -->
          <div style="text-align: center; margin: 25px 0;">
            <div style="display: inline-block; padding: 15px 25px; background: #0077b6; color: white; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px;">
              ${otp}
            </div>
          </div>
          
          <!-- Important Note -->
          <div style="background: #fff8e1; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
            <p style="color: #333; margin: 0; font-weight: bold;">⚠️ Important:</p>
            <ul style="color: #555; font-size: 14px; padding-left: 20px; margin: 10px 0 0 0;">
              <li>This OTP is valid for 10 minutes only</li>
              <li>Do not share this OTP with anyone</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
          </div>
          
          <!-- Support Section -->
          <div style="margin-top: 20px; padding: 15px; border-left: 5px solid #0077b6; background: #eef7fc; border-radius: 6px;">
            <p style="color: #333;"><strong>Need Help?</strong></p>
            <p style="color: #555;">If you're having trouble, please contact our support team.</p>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd;">
            <p style="color: #555; font-size: 14px;"><strong>Hospital Management Team</strong></p>
            <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply.</p>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
 
    return true;
    
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error; // Rethrow to handle in calling function
  }
};

export default sendOtpForRegistration;