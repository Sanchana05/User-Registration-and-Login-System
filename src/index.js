const express = require('express');
const dbConnect = require('./config/dbConnect');
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/authroutes.js');
const userRoutes = require('./routes/userRoutes.js');
const router = express.Router();
const mongoose = require("mongoose");

const app = express();


app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register");
});
app.get("/login", (req, res) => {
    res.render("login");  
});



app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

dbConnect();
const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
    console.log(`To access, click on "http://localhost:${PORT}/"`)
})