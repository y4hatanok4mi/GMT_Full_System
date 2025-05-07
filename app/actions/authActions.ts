"use server";

import { signIn, signOut } from "@/auth";
import { ResetPasswordSchema, ResetSchema, signUpSchema } from "@/lib/schema";
import { AuthError } from "next-auth";

import { v4 as uuidv4 } from "uuid";
import bcryptjs from "bcryptjs";
import prisma from "@/lib/prisma";
import { userGender, userRole, userSchool } from "@prisma/client";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/mail/email";
import axios from "axios";

interface SignInResponse {
  ok: boolean;
  error?: string;
}

export async function handleCredentialsSignin({
  id_no,
  password,
}: {
  id_no: string;
  password: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { id_no },
    });

    if (!user) {
      return {
        error: "User not found!",
      };
    }

    // Check if the user has verified their email
    if (!user.isEmailVerified) {
      return {
        error:
          "Account not verified! Please check your email for the verification link.",
      };
    }

    // If the user is verified, proceed with password validation
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return {
        error: "Invalid credentials!",
      };
    }

    // Successful sign-in
    const signInResult: SignInResponse = await signIn("credentials", {
      id_no,
      password,
    });

    if (!signInResult.ok) {
      return {
        error: "Something went wrong during sign-in!",
      };
    }

    return { success: true, message: "Successfully signed in!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid credentials!",
          };
        default:
          return {
            error: "Something went wrong!",
          };
      }
    }
    console.error("Error during sign-in:", error);
    throw error;
  }
}

export async function handleSignOut() {
  await signOut({
    redirectTo: "/auth/signin",
    redirect: true,
  });
}

export async function handleSignUp({
  email,
  password,
  confirmPassword,
  fname,
  lname,
  bday,
  gender,
  school,
  role,
  id_no,
}: {
  fname: string;
  lname: string;
  email: string;
  password: string;
  confirmPassword: string;
  bday: Date;
  gender: userGender;
  school: userSchool;
  role: userRole;
  id_no: string;
}) {
  try {
    const parsedCredentials = signUpSchema.safeParse({
      email,
      password,
      confirmPassword,
      fname,
      lname,
      bday,
      gender,
      school,
      role,
      id_no,
    });

    if (!parsedCredentials.success) {
      console.log("Validation failed:", parsedCredentials.error);
      return { success: false, message: "Invalid data!" };
    }

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return { success: false, message: "Email already exists!" };
    }

    const existingUserByIDNo = await prisma.user.findUnique({
      where: { id_no },
    });

    if (existingUserByIDNo) {
      return { success: false, message: "ID No. already exists!" };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        name: `${fname} ${lname}`,
        email,
        password: hashedPassword,
        birthday: bday,
        gender,
        school,
        role,
        id_no,
      },
    });

    // Generate a verification token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Set token expiration (e.g., 1 hour from creation)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration

    // Store the token and its expiration in the database
    await prisma.verificationToken.create({
      data: {
        email, // Use email as reference for User relation
        token: verificationToken,
        expiresAt, // Store expiration time
      },
    });

    // Send the verification email with the token
    await sendVerificationEmail(email, verificationToken);

    return { success: true, message: "Confirmation email sent!" };
  } catch (error) {
    console.error("Error creating account:", error);
    return {
      success: false,
      message: "An unexpected error occurred! Please try again.",
    };
  }
}

export async function handleResetPasswordRequest(input: { email: string }) {
  const { email } = input;

  try {
    const parsed = ResetSchema.safeParse({ email });
    if (!parsed.success) {
      return { success: false, message: "Invalid email format." };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: "Email not found." };
    }

    const resetToken = uuidv4();

    await prisma.passwordResetToken.create({
      data: {
        email,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiration
      },
    });

    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    const resetUrl = `${baseUrl}/auth/reset-password?email=${encodeURIComponent(
      email
    )}`;

    await sendPasswordResetEmail(email, resetUrl);
    console.log("Reset URL:", resetUrl);
    console.log("Email sent to:", email);

    return { success: true, message: "Reset email sent!" };
  } catch (error) {
    console.error("Reset error:", error);
    return {
      success: false,
      message: "Something went wrong. Try again later.",
    };
  }
}

export async function handleResetPassword({ email, password, confirmPassword }: { email: string; password: string; confirmPassword: string }) {
    // Validate input using zod schema
    const parsed = ResetPasswordSchema.safeParse({ email, password, confirmPassword });
    if (!parsed.success) {
      throw new Error("Invalid input");
    }
  
    const { email: validEmail, password: validPassword } = parsed.data;
    console.log("Valid email:", validEmail);
    console.log("Valid password:", validPassword);
  
    try {
      // Check if the user exists
      const user = await prisma.user.findUnique({
        where: { 
            email: validEmail 
        },
      });
  
      if (!user) {
        throw new Error("User not found.");
      }
  
      // Hash the new password
      const hashedPassword = await bcryptjs.hash(validPassword, 10);
  
      // Update the user's password in the database
      await prisma.user.update({
        where: { 
            email: validEmail 
        },
        data: { 
            password: hashedPassword 
        },
      });
  
      return { success: true, message: "Password has been reset!" };
    } catch (error) {
      console.error("Error resetting password:", error);
      throw new Error("Something went wrong. Please try again.");
    }
  }
