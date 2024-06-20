const express = require('express');
require("dotenv").config();

const{ signupSchoolDatabase,schoolBasicinfo,loginschool,
    signUpschool,verifyOtp,updateBasicinfo,changePassword,
    sendotpforPassword,showAllTeacher,showOneTeacher,deleteTeacher}= require("./auth_controller");


const registerAllUsers = express.Router();

registerAllUsers.get("/signupSchoolDatabase",signupSchoolDatabase)
registerAllUsers.post("/schoolBasicinfo",schoolBasicinfo)
registerAllUsers.post("/loginschool",loginschool)
registerAllUsers.post("/signUpschool",signUpschool)
registerAllUsers.post("/verifyOtp",verifyOtp);
registerAllUsers.post("/updateBasicinfo",updateBasicinfo)
registerAllUsers.post("/changePassword",changePassword)
registerAllUsers.post("/sendotpforPassword",sendotpforPassword)
registerAllUsers.post("/showAllTeacher",showAllTeacher)
registerAllUsers.post("/showOneTeacher",showOneTeacher)
registerAllUsers.post("/deleteTeacher",deleteTeacher)

module.exports = registerAllUsers;