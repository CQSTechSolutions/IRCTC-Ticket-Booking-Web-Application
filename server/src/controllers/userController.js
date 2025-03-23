import userModel from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register Function
export const registerUser = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;
        const existUser = await userModel.findOne({ email });
        if (existUser) {
            return res.status(401).json({ success: false, message: "User already exists" });
        }
        const newUser = new userModel({
            name, phone, email, password
        });
        await newUser.save();
        res.status(200).json({ message: "User Registered Successfully", newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
        console.log(error);
    }
};

// Login Function with JWT Token
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid Credentials" });
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(404).json({ success: false, message: "Invalid Credentials" });
        }

        // Create JWT Token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
        console.log(error);
    }
};

// Logout Function
export const logoutUser = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: "Logout Successful" });
        // To fully logout, the client must remove the token from localStorage/cookies on their side.
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};