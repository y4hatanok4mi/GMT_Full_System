"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { signUpSchema } from "@/lib/schema";
import prisma from "@/lib/prisma";
import { getUserByEmail, getUserByIDNo } from "@/data/user";

export const HandleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    const validatedFields = signUpSchema.safeParse(values);


    if(!validatedFields.success) {
        return { success: false, message: "Invalid fields!" };
    }

    const { email, password, fname, lname, gender, bday, school, role, id_no} = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUserByEmail = await getUserByEmail(email);
    const existingUserByIDNo = await getUserByIDNo(id_no);

    if(existingUserByEmail) {
        return { success: false, message: "Email already in use!" };
    }

    if(existingUserByIDNo) {
        return { success: false, message: "ID No. already exists!" }
    }

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: `${fname} ${lname}`,
            gender,
            birthday: bday,
            school,
            role,
            id_no
        },
    });
    
    // TODO: Send verification token email
    return { success: true, message: "Account created successfully!" };
}