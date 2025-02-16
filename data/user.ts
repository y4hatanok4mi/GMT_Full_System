import prisma from "@/lib/prisma";


export const getUserByIDNo = async (id_no: string ) => {
    try {
        const user = await prisma.user.findUnique({ where: { id_no } });

        return user;
    } catch {
        return null;
    }
}

export const getUserByEmail = async (email: string ) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });

        return user;
    } catch {
        return null;
    }
};