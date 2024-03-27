const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

const sendMail = async ({ email, html, subject }) => {
    const info = await transporter.sendMail({
        from: '"cuahangthucphamchucnang" <no-reply@example.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: html, // html body
    });

    return info;
};

module.exports = sendMail;
