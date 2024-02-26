const nodemailer = require('nodemailer');



async function config(toMail, subject,text){
    // create an email transporter.
    // SMTP
   const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "", // G-Mail Id 
            pass: "" // your password
        }
    })

    // configure email content 

    const mailOptions = {
        from :"", // G-Mail Id 
        to : toMail,
        subject: subject,
        text: text
    }

    try {
        transporter.sendMail(mailOptions);
        console.log("Email Send Successfully");
    } catch (error) {
        console.log("Email send failed with error:", error);
    }
}


module.exports = config;

