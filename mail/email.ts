import dotenv from "dotenv";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "@/mail/email-template";
import transporter from "@/lib/transporter";


dotenv.config();
  
  export const sender = {
    email: process.env.EMAIL_USER,
    name: "GeomeTriks",
  };
  

  interface Recipient {
    email: string;
  }
  
  export const sendVerificationEmail = async (email: string, verificationToken: string): Promise<void> => {
    try {
      const info = await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Verify your email",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      });
  
      console.log("Verification email sent successfully!", info.messageId);
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error(`Error sending verification email: ${error}`);
    }
  };
  
  export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
    try {
      const info = await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Welcome to GeomeTriks!",
        html: `<p>Hello ${name},</p><p>Welcome to GeomeTriks! We're glad to have you on board.</p>`,
      });
  
      console.log("Welcome email sent successfully!", info.messageId);
    } catch (error) {
      console.error("Error sending welcome email:", error);
      throw new Error(`Error sending welcome email: ${error}`);
    }
  };
  
  // Send Password Reset Email
  export const sendPasswordResetEmail = async (email: string, resetURL: string): Promise<void> => {
    try {
      const info = await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Reset your password",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      });
  
      console.log("Password reset email sent successfully!", info.messageId);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw new Error(`Error sending password reset email: ${error}`);
    }
  };
  
  // Send Password Reset Success Email
  export const sendResetSuccessEmail = async (email: string): Promise<void> => {
    try {
      const info = await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Password Reset Successful!",
        html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      });
  
      console.log("Password reset success email sent successfully!", info.messageId);
    } catch (error) {
      console.error("Error sending password reset success email:", error);
      throw new Error(`Error sending password reset success email: ${error}`);
    }
  };