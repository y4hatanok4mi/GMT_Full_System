import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail's SMTP service
  auth: {
    user: process.env.EMAIL_USER, // Gmail address
    pass: process.env.EMAIL_PASS, // App password or email password
  },
});

export default transporter;
