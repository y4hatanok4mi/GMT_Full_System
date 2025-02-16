import prisma from '@/lib/prisma';
import { sendWelcomeEmail } from '@/mail/email';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { code }: { code: string } = await req.json();

    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: {
                token: code,
            },
            include: {
                user: true,
            }
        });

        if (!verificationToken || verificationToken.expiresAt < new Date()) {
            return NextResponse.json({ success: false, message: 'Invalid or expired verification code!' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { email: verificationToken.email },
            data: {
                isEmailVerified: true,
                emailVerified: new Date(),
            },
        });

        await prisma.verificationToken.delete({
            where: {
                id: verificationToken.id,
            },
        });

        await sendWelcomeEmail(updatedUser.email, updatedUser.name);

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully!',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                isEmailVerified: updatedUser.isEmailVerified,
            },
        });
    } catch (error) {
        console.error('Error in verifying email!', error);
        return NextResponse.json({ success: false, message: 'Server error!' }, { status: 500 });
    }
}
