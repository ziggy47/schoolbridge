const mysqlLive = require("../../mysql");

var jwt = require('jsonwebtoken');

const signupS = "signupschool";

const bcrypt = require('bcrypt');
const sendmain = require("../../sendmails");

const {json} = require("express");

const signupSchoolDatabase = async(req,res)=>
{
   var dtext =`
   CREATE TABLE ${signupS}
   (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname TEXT,
    phonenumber TEXT,
    address TEXT,
    country TEXT,
    state TEXT,
    city TEXT,
    schooltype TEXT,
    schoolteam_size TEXT,
    schoolstudent_size TEXT,
    schoolId TEXT,
    logo TEXT,
    email TEXT,
    password TEXT,
    otp TEXT,
    token TEXT,
    userVerify TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_email (email(255)),
    UNIQUE KEY unique_schoolId (schoolId(255))
   )
   `;
   mysqlLive.query(dtext,(error,result)=>
{
    if (error) {
        return res.send("error in creating table");
    } else {
        return res.send("Table successfully created");
    }
})
}

const schoolSignup = async(req,res)=>
{
    const{email,password,fullname,
        phonenumber,
        address,
        country,
        state,
        city,
        schooltype,
        schoolteam_size,
        schoolstudent_size,
        logo
        }=req.body;

    const missingFields = [];

    if(!email) missingFields.push('email');
    if(!password) missingFields.push('password');
    if(!fullname) missingFields.push('fullname');
    if(!phonenumber) missingFields.push('phonenumber');
    if(!address) missingFields.push('address');
    if(!country) missingFields.push('country');
    if(!state) missingFields.push('state');
    if(!city) missingFields.push('city');
    if(!schooltype) missingFields.push('schooltype');
    if(!schoolteam_size) missingFields.push('schoolteam_size');
    if(!schoolstudent_size) missingFields.push('schoolstudent_size');
    if(!logo) missingFields.push('logo');

    if(missingFields.length > 0)
    {
        return res.status(400).json({error:'Missing required fields', missingFields})
    }

    const saltRounds = 10;
        const generateOtp=`${Math.floor(1000 + Math.random() * 5)}`;

        const timestamp = new Date().getTime();
        const randomNum = Math.floor(Math.random() * 100000);
        const schoolid = `S${timestamp + randomNum}`;

        var token = jwt.sign({fullname: `${fullname}`,phonenumber:`${phonenumber}`,address:`${address}`,country:`${country}`,state:`${state}`,city:`${city}`,email:`${email}`,password:`${password}`},process.env.JWTSECRET);

        const hashpassword = await bcrypt.hash(password, saltRounds);

        var insertuser =`
        INSERT INTO ${signupS}
        (
            fullname,
            phonenumber,
            address,
            country,
            state,
            city,
            schooltype,
            schoolteam_size,
            schoolstudent_size,
            schoolId,
            logo,
            email,
            password,
            otp,
            token,
            userVerify
        )
        VALUES
        (
           '${fullname}',
        '${phonenumber}',
        '${address}',
        '${country}',
        '${state}',
        '${city}',
        '${schooltype}',
        '${schoolteam_size}',
        '${schoolstudent_size}',
            '${schoolid}',
            '${logo}',
            '${email}',
            '${hashpassword}',
            '${generateOtp}',
            '${token}',
            'False'
        )
        `;
        mysqlLive.query(insertuser, async (error, result) => {
            if (error) {
                
                return res.status(404).json({ error: error.sqlMessage });
            }
            if(result){
                const htmlEmail = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Here is your UserName</title>
            </head>
            <body>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                        <td align="center" bgcolor="#ffffff" style="padding: 40px 0 30px 0;">
                
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <h1>Your Email Content</h1>
                            <p>Your Otp is ${generateOtp}.</p>
                            <p>Enter this otp to verify your TMS account</p>
                            <a href="https://nuelron.com" style="text-decoration: none; background-color: #007BFF; color: #ffffff; padding: 10px 20px; border-radius: 5px;">Visit Our Website</a>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#007BFF" style="padding: 20px 0;">
                            <p style="color: #ffffff; text-align: center;">&copy; 2023 Your Company Name. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
          `;
                sendmain(email,"otp",htmlEmail);
                return res.status(200).json({result:"otp as been sent to your mail"});
        }})
    }


const loginschool = async(req,res)=>
{
    try
    {
        const { email,password}= req.body;

        if(!email || !password)
        {
            return res.status(400).json({error:"Missing Field Required"})
        }

        const dtext=`
        SELECT *
        FROM ${signupS}
        WHERE email = "${email}"`;
        
        const userExist = await queryDatabase(dtext);

        if(userExist.length <= 0)
        {
            return res.status(401).json({error:'User not found'});
        }

        const storedPasswordHash = userExist[0].password;
        const isPasswordValid = await bcrypt.compare(password, storedPasswordHash);
        
        if(!isPasswordValid)
        {
            return res.status(401).json({error:"Incorrect Details"});

        }

        return res.status(200).json({
            "email": userExist[0].email,
            "token": userExist[0].token,
            "schoolId": userExist[0].schoolId
            
        })
    }
    catch (error) {
        //console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateDetails = async(req,res)=>
{
    const authHeader = req.headers["authorization"];
    if(!authHeader)
    {
        return res.status(401).json({error:"Authorization header missing"});
    }

    const token = authHeader.split(" ")[1]
    if (!token) {
        return res.status(401).json({ error: "JWT token missing" });
    }

    const decodedToken = jwt.verify(token, "shhhh")
    const email = decodedToken.email;

    const updateData =
    {
    fullname:req.body.fullname,   
    phonenumber:req.body.phonenumber,
    address:req.body.address,
    country:req.body.country,
    state:req.body.state,
    city:req.body.city,
    schooltype:req.body.schooltype,
    schoolteam_size:req.body.schoolteam_size,
    schoolstudent_size:req.body.schoolstudent_size,
    schoolId:req.body.schoolId,
    logo:req.body.logo,
    email:req.body.email,
    password:req.body.password,
    deviceType:req.body.deviceType    
}

const filteredUpdateDate = Object.fromEntries(
    Object.entries(updateData).filter(([_,value])=> value !==undefined));

const updateQuery =`
UPDATE ${signupS}
SET ?
WHERE email =?
`;

try
{
   mysqlLive.query(updateQuery,[filteredUpdateDate, email], (err, result)=>
    {
        if(err)
            {
                if(err.errno === 1054)
                    {
                        return res.status(401).json({error:"Invalid field name in the update data" + err })
                    }
                    return res.status(401).json({error:err});
                                           
            }
            if(result.affectedRows === 0)
                {
                    return res.status(404).json({error:"User not found"})
                }

                res.status(200).json({message:"User updated successfully"})
    }
);
}
catch(e)
{
    return res.status(401).json({error: e});
}
}

const queryDatabase = (query) => {
    return new Promise((resolve, reject) => {
      mysqlLive.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

module.exports = {signupSchoolDatabase,schoolSignup,loginschool,updateDetails}