const nm = require('nodemailer');
const MAIL_SETTINGS = {
  service: 'gmail',
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
};

const transporter = nm.createTransport(MAIL_SETTINGS);

module.exports.sendOtpMail = async (email,otp) => {
  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: email,
      subject: 'User registeration OTP for HamroTask application ✔',
      html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Welcome to the hamro store.</h2>
          <h4>You are officially In ✔</h4>
          <p style="margin-bottom: 30px;">Pleas enter the OTP to get verified!</p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
     </div>
      `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};