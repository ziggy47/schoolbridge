const express = require('express');
require("dotenv").config();

const{ signupSchoolDatabase,schoolBasicinfo,loginschool,
    signUpschool,verifyOtp,updateBasicinfo}= require("./auth_controller");


const registerAllUsers = express.Router();

registerAllUsers.get("/signupSchoolDatabase",signupSchoolDatabase)
registerAllUsers.post("/schoolBasicinfo",schoolBasicinfo)
registerAllUsers.post("/loginschool",loginschool)
registerAllUsers.post("/signUpschool",signUpschool)
registerAllUsers.post("/verifyOtp",verifyOtp);
registerAllUsers.post("/updateBasicinfo",updateBasicinfo)

module.exports = registerAllUsers;