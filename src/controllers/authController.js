const User = require("../models/userModel")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { email, username, password, role } = req.body;
        if (!email || !username || !password || !role) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists with this email or username." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            username,
            password: hashedPassword,
            role
        });
        await newUser.save();
        res.status(201).json({ message: `User ${username} registered successfully.` });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Incorrect password");
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        
        if (user.role === "admin") {
            const users = await User.find();
            return res.render("admin", {users}); 
        } else {
            const { email, username: uname} = user;
            return res.render("dashboard", {user: {email, username: uname}});
        }

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).send("Something went wrong");
    }
};


module.exports = {
    register,
    login,
}

