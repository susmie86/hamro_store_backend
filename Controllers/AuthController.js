const userModel = require("../models/users.js");
const otpService = require(`../services/otp.js`);
const hashPassword = require(`../services/hash_password.js`);
const token = require(`../middleware/jwt_handler.js`);
const emailService = require(`../services/mail_service.js`);
const jwtHandler = require('../middleware/jwt_handler');

//====>>>> Sign Up <<<<====//
module.exports.signUpUser = async (req, res) => {
    // try {
    // Taking User's data
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    let errors = [];

    // CHecking if user entered any null data
    if (firstName == undefined || firstName == "") {
        errors.push('Please provide a first name.');
    }

    if (lastName == undefined || lastName == "") {
        errors.push('Please provide a last name.');
    }

    if (userEmail == undefined || userEmail == "") {
        errors.push('Please provide an email.');
    } else {
        const isEmailValid = checkEmailValidity(userEmail);
        if (!isEmailValid) {
            errors.push('Please provide a valid email.');
        }
    }

    if (userPassword == undefined || userPassword == "") {
        errors.push('Please enter a password.')
    }

    if (errors.length > 0) {
        throw { code: 'VALIDATION_ERROR', message: errors };
    } else {

        // Checking If Provided email already exist in DB 
        const emailData = await userModel.findOne({ email: userEmail });
        if (emailData != null) {
            throw { code: "VALIDATION_ERROR", message: "This user already exists" };
        }

        console.log(emailData);

        const hashedPassword = await hashPassword.hashPasswordGenerator(userPassword);
        const generatedOTP = otpService.otpGenerator();

        // Storing All data into database
        const userData = await userModel.create({
            firstName: firstName,
            lastName: lastName,
            email: userEmail,
            password: hashedPassword,
            otp: generatedOTP
        });

        console.log("Running");
        // Send otp to email
        const sendOtp = emailService.sendOtpMail(userData.email, userData.otp);
        console.log(sendOtp);

        const newData = {
            _id: userData._id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            isVerified: userData.isVerified
        }

        console.log("Running new data");

        res.json({
            "status": "Success",
            "message": "Registration Complete",
            "data": newData
        });
    }
}

//====>>>> Verify User <<<<====//
module.exports.verifyEmail = async (req, res) => {

    // Taking User's Email and OTP
    const email = req.body.email;
    const OTP = req.body.otp;

    let errors = [];

    // Checking if any null data is present or not
    if (email == undefined || email == "") {
        errors.push('Please Provide your email.');
    } else {
        const isEmailValid = checkEmailValidity(email);
        if (!isEmailValid) {
            errors.push('Please provide a valid email.');
        }
    }

    if (OTP == undefined || OTP == "") {
        errors.push('Please Enter your OTP.');
    }
    if (errors.length > 0) {
        throw errors;
    } else {
        // Check if Email matched with Database
        const emailData = await userModel.findOne({ email: email });

        if (emailData == null) {
            throw 'Your Email is not Registered.';
        }
        if (emailData.isVerified == true) {
            throw "Your email is already verified."
        }
        else {
            // Checking if provided OTP match with OTP in DB
            if (OTP != emailData.otp) {
                throw 'your otp is not match.';
            } else {
                await userModel.findByIdAndUpdate(emailData._id, {
                    isVerified: true
                });
            }

            res.json({
                "status": "Success",
                "message": "Verification Complete.",
                "data": null
            })
        }
    }
}

//====>>>> Sign In <<<<====//
module.exports.signIn = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    let errors = [];

    // Checking IF Entered data is null or not
    if (email == undefined || email == "") {
        errors.push('Please provide a email.');
    } else {
        const isEmailValid = checkEmailValidity(email);
        if (!isEmailValid) {
            errors.push('Please provide a valid email.');
        }
    }

    if (password == undefined || password == "") {
        errors.push('Please Enter your password.');
    }

    if (errors.length > 0) {
        throw { code: "VALIDATION_ERROR", message: errors };
    } else {

        const emailData = await userModel.findOne({ email: email });

        if (emailData == null) {
            throw "This Email is not Registered.";
        }

        if (emailData.isVerified != true) {
            throw "This Email is not verified";
        } else {
            const isCorrectPassword = await hashPassword.comparePassword(password, emailData.password);
            if (isCorrectPassword == false) {
                throw "Your password is wrong.";
            } else {

                const accessToken = token.createNewAccessToken(emailData.email);
                const refreshToken = token.createNewRefreshToken(emailData.email);
                res.json({
                    "status": "Success",
                    "message": "Log in successfull.",
                    "data": {
                        "accessToken": accessToken,
                        "refreshToken": refreshToken
                    }
                });
            }
        }
    }
}

//====>>>> Get all users <<<<====//
module.exports.getAllUsers = async (req, res) => {
    const users = await userModel.find();
    res.json({
        "status": "Success",
        "message": "Got all users",
        "data": users
    });
}

//====>>>> Get a user <<<<====//
module.exports.getUser = async (req, res) => {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
        throw "User doesn't exists.";
    } else {
        res.json({
            "status": "Success",
            "message": "Got a user successfully",
            "data": user
        });
    }
}

//====>>>> Delete a user <<<<====//
module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser) {
        throw "User doesn't exists.";
    } else {
        res.json({
            "status": "Success",
            "message": "Deleted user Successfully.",
            "data": deletedUser
        });
    }
}

//====>>>> Update a user <<<<====//
module.exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const updatedUser = await userModel.findByIdAndUpdate(id, {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email
    });

    if (!updatedUser) {
        throw "User doesn't exists.";
    } else {
        res.json({
            "status": "Success",
            "message": "Updated user Successfully.",
            "data": updatedUser
        });
    }
}

//====>>>> Check Email Validity <<<<====//
const checkEmailValidity = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const isEmailValid = re.test(String(email).toLowerCase());
    return isEmailValid;
}