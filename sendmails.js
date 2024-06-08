const nodemailer = require('nodemailer');

async function sendmain(email,title,html)
{
   const transporter = nodemailer.createTransport(
    {
        host: "premium199.web-hosting.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: "info@moniebag-project.nuelron.com",
          pass: "Adedoyin/1995",
        },
    }
   );

   const info = await transporter.sendMail({
    from: '"FundWallet" <info@moniebag-project.nuelron.com>', // sender address
    to: email, // list of receivers
    subject: title, // Subject line
    text: "", // plain text body
    html: html, // html body
   });

   console.log("Message sent: %s", info.messageId);
}

module.exports = sendmain;