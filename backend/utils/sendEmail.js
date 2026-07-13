import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log("SMTP Error:", error);
    } else {
        console.log("SMTP Server is ready");
    }
});

const sendEmail = async ({ to, subject, html }) => {
    await transporter.sendMail({
        from: '"CodeRelix CMS" <noreply@gmail.com>',
        to,
        subject,
        html
    });
};

export default sendEmail;