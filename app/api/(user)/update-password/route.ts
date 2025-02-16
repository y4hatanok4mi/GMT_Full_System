import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

export async function PATCH(req: Request) {
    try {
        const user = await auth();
        const userId  = user?.user.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();
        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: Number(userId) },
        });

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Compare current password with stored hashed password
        const passwordMatch = await bcrypt.compare(currentPassword, currentUser.password);
        if (!passwordMatch) {
            return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in database
        await prisma.user.update({
            where: { id: Number(userId) },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error updating password:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
