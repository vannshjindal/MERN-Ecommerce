const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');

async function userSignUpController(req, res) {
   
    try {
        const { email, phoneNumber, password, name } = req.body;
        let profilePicture = req.body.profilePicture || null; 

      
        if (req.file) {
            profilePicture = req.file.path; 
        }

   
        if (!email && !phoneNumber) {
            throw new Error("Please provide an email or phone number");
        }
        if (!password) {
            throw new Error("Please provide a password");
        }
        if (!name) {
            throw new Error("Please provide a name");
        }

        const existingUser = await userModel.findOne({ 
            $or: [{ email }, { phoneNumber }] 
        });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                error: true,
                message: "User already exists with this email or phone number." 
            });
        }

   
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        if (!hashPassword) {
            throw new Error("Something went wrong while hashing the password");
        }

        const userData = new userModel({
            name,
            email: email || null,
            phoneNumber: phoneNumber || null,
            password: hashPassword,
            profilePicture, 
            role: "GENERAL"
        });

   
        const savedUser = await userData.save();

        res.status(201).json({
            data: savedUser,
            success: true,
            error: false,
            message: "User created successfully!"
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || "Something went wrong",
            error: true,
            success: false,
        });
    }
}

module.exports = userSignUpController;
