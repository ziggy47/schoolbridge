const express = require('express');

const{ signupSchoolDatabase,schoolSignup,loginschool,updateDetails }= require("./auth_controller");

const registerAllUsers = express.Router();
registerAllUsers.get("/signupSchoolDatabase",signupSchoolDatabase);
registerAllUsers.post("/schoolDetails",schoolSignup)
registerAllUsers.post("/loginschool",loginschool)
registerAllUsers.post("/updateDetails",updateDetails)

module.exports = registerAllUsers;