const otpGenerator = require(`otp-generator`);

module.exports.otpGenerator = () => {
    const generatedOtp = otpGenerator.generate(6, { 
        lowerCaseAlphabets:false, 
        upperCaseAlphabets: false, 
        specialChars: false 
    });

    return `${generatedOtp}`;
}