"use server";

import { signIn, signOut } from "@/auth";
import { signUpSchema } from "@/lib/schema";
import { AuthError } from "next-auth";

import bcryptjs from "bcryptjs";
import prisma from "@/lib/prisma";
import { userGender, userRole, userSchool } from "@prisma/client";
import { sendVerificationEmail } from "@/mail/email";

interface SignInResponse {
    ok: boolean;
    error?: string;
}

export async function handleCredentialsSignin({ id_no, password }: { id_no: string; password: string }) {
    try {
        // Check if user exists with the provided ID number
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
                error: "Account not verified! Please check your email for the verification link.",
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
        const signInResult: SignInResponse = await signIn("credentials", { id_no, password });

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
    id_no
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
            id_no
        });
        
        if (!parsedCredentials.success) {
            console.log("Validation failed:", parsedCredentials.error);
            return { success: false, message: "Invalid data!" };
        }

        const existingUserByEmail = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUserByEmail) {
            return { success: false, message: "Email already exists!" };
        }

        const existingUserByIDNo = await prisma.user.findUnique({
            where: { id_no }
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
                id_no
            }
        });

        // Generate a verification token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Set token expiration (e.g., 1 hour from creation)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration

        // Store the token and its expiration in the database
        await prisma.verificationToken.create({
            data: {
                email, // Use email as reference for User relation
                token: verificationToken,
                expiresAt // Store expiration time
            }
        });

        // Send the verification email with the token
        await sendVerificationEmail(email, verificationToken);

        return { success: true, message: "Confirmation email sent!" };
    } catch (error) {
        console.error("Error creating account:", error);
        return { success: false, message: "An unexpected error occurred! Please try again." };
    }
}

