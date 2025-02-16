import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 
import { z } from "zod";
import { auth } from "@/auth";

const updateProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(1, "ID Number is required"),
    birthday: z.string().min(1, "Birthday is required"),
    image: z.string().min(1, "Image is required"),
});

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const validatedData = updateProfileSchema.parse(body);
        
        const user = await auth();
        const userId = user?.user.id;

        // Update the profile in the database
        const updatedUser = await prisma.user.update({
            where: { id: Number(userId) },
            data: {
                name: validatedData.name,
                username: validatedData.username,
                image: validatedData.image,
                birthday: new Date(validatedData.birthday),
            },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}
