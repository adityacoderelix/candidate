import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

const sendEmail = async ({ to, subject, html }) => {
    try {
        await transporter.sendMail({
            from: `"CodeRelix CMS" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });

        console.log("Email sent successfully to:", to);

    } catch (error) {
        console.log("Email sending failed:", error);
        throw error;
    }
};

export default sendEmail;