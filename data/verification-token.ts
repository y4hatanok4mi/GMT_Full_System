import prisma from "@/lib/prisma";

export const getVerificationTokenByToken = async (token: string) => {
    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: {
                token,
            },
        });
        return verificationToken;
    } catch (error) {
        console.error("Error fetching verification token by token:", error);
        return null;
    }
};


export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                email,
            },
        });
        return verificationToken;
    } catch (error) {
        console.error("Error fetching verification token by email:", error);
        return null;
    }
};
