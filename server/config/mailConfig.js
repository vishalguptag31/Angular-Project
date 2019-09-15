var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");

exports.transporter =  nodemailer.createTransport({
    host: 'mail.cirrusworldtour.club',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'support@cirrusworldtour.club', 
        pass: 'Open4Me2' 
    }
});


exports.sender = "support@cirrusworldtour.club";
// exports.transporter =  nodemailer.createTransport({
//     host: 'smtp.live.com',
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: 'amitchauhan2@hotmail.com', 
//         pass: 'Q3edge@837' 
//     }
// })