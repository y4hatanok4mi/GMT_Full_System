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

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    return await prisma.passwordResetToken.findUnique({
      where: {
        token,
      },
    });
  } catch (error) {
    console.error("Error fetching reset token:", error);
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        email,
      },
    });
    return resetToken;
  } catch (error) {
    console.error("Error fetching reset token by email:", error);
    return null;
  }
};
